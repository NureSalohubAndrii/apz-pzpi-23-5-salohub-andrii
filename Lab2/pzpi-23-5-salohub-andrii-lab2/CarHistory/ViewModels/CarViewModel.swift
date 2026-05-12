//
//  CarViewModel.swift
//  CarHistory
//
//  Created by Andrii Salohub on 06.05.2026.
//

import Foundation
import SwiftUI
import Combine

class CarViewModel: ObservableObject {
    @Published var searchedCar: Car? = nil
    @Published var isLoading: Bool = false
    @Published var errorMessage: String = ""
    @Published var searchSuccess: Bool = false
    
    @AppStorage("jwt_token") var token: String = ""
    
    func searchCarByVIN(vin: String) {
        guard !vin.isEmpty else {
            self.errorMessage = "Please enter a VIN code"
            return
        }
        
        isLoading = true
        errorMessage = ""
        searchedCar = nil
        searchSuccess = false
        
        guard let url = URL(string: "\(Constants.baseURL)/cars/vin/\(vin.uppercased())") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                self.isLoading = false
                if let error = error {
                    self.errorMessage = error.localizedDescription
                    return
                }
                
                guard let data = data else {
                    self.errorMessage = "No data received"
                    return
                }
                
                do {
                    let decoded = try JSONDecoder().decode(ApiResponse<Car>.self, from: data)
                    if decoded.success {
                        self.searchedCar = decoded.data
                        self.searchSuccess = true
                    } else {
                        self.errorMessage = decoded.message ?? "Car not found"
                    }
                } catch {
                    self.errorMessage = "Car not found in database."
                }
            }
        }.resume()
    }
        
    func addCar(
        vin: String,
        make: String,
        model: String,
        year: Int,
        mileage: Int,
        mileageUnit: String,
        color: String,
        engineType: String,
        transmission: String,
        fuelType: String,
        description: String,
        completion: @escaping (Bool) -> Void
    ) {
        isLoading = true
        errorMessage = ""
        
        guard let url = URL(string: "\(Constants.baseURL)/cars") else { return }
        
        var body: [String: Any] = [
            "vin": vin.uppercased(),
            "make": make,
            "model": model,
            "year": year,
            "currentMileage": mileage,
            "mileageUnit": mileageUnit,
            "transmission": transmission,
            "fuelType": fuelType
        ]
        
        if !color.isEmpty { body["color"] = color }
        if !engineType.isEmpty { body["engineType"] = engineType }
        if !description.isEmpty { body["description"] = description }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                self.isLoading = false
                if let error = error {
                    self.errorMessage = error.localizedDescription
                    completion(false)
                    return
                }
                
                guard let data = data else {
                    self.errorMessage = "No data received"
                    completion(false)
                    return
                }
                
                do {
                    let decoded = try JSONDecoder().decode(ApiResponse<Car>.self, from: data)
                    if decoded.success {
                        completion(true)
                    } else {
                        self.errorMessage = decoded.message ?? "Error adding car"
                        completion(false)
                    }
                } catch {
                    self.errorMessage = "Error parsing response"
                    completion(false)
                }
            }
        }.resume()
    }
}
