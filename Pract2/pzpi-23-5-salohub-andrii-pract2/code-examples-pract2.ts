import * as h3 from 'h3-js';
import redisClient from './redis-client';

export async function updateDriverLocation(
  driverId: string,
  lat: number,
  lng: number
) {
  const resolution = 9;

  const h3Index = h3.latLngToCell(lat, lng, resolution);

  await redisClient.sAdd(`zone:${h3Index}:active_drivers`, driverId);

  await redisClient.geoAdd('city_drivers_locations', lng, lat, driverId);

  return h3Index;
}

export class SurgePricingService {
  private readonly SURGE_THRESHOLD = 0.8;
  private readonly MAX_SURGE_MULTIPLIER = 3.5;

  public calculateMultiplier(
    activeDrivers: number,
    activeRequests: number
  ): number {
    if (activeDrivers === 0 && activeRequests > 0) {
      return this.MAX_SURGE_MULTIPLIER;
    }

    if (activeRequests === 0) {
      return 1.0;
    }

    const demandSupplyRatio = activeRequests / activeDrivers;

    if (demandSupplyRatio > this.SURGE_THRESHOLD) {
      let multiplier = 1.0 + (demandSupplyRatio - this.SURGE_THRESHOLD) * 1.5;

      return Math.min(
        Math.round(multiplier * 10) / 10,
        this.MAX_SURGE_MULTIPLIER
      );
    }

    return 1.0;
  }

  public generateFinalFare(
    baseFare: number,
    h3ZoneId: string,
    drivers: number,
    requests: number
  ): number {
    const surgeMultiplier = this.calculateMultiplier(drivers, requests);
    const finalPrice = baseFare * surgeMultiplier;

    return finalPrice;
  }
}

const pricing = new SurgePricingService();
