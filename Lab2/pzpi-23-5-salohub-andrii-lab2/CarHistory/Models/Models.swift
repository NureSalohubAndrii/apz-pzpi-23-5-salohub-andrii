//
//  Models.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import Foundation

struct ApiResponse<T: Codable>: Codable {
    let success: Bool
    let message: String?
    let data: T?
}

struct User: Codable {
    let id: String
    let email: String
    let firstName: String?
    let lastName: String?
    let role: String
    let emailVerified: Bool
}

struct AuthData: Codable {
    let user: User
    let token: String
}

struct RegisterData: Codable {
    let message: String?
    let userId: String
}

struct RefreshData: Codable {
    let token: String
}

struct UserStats: Codable {
    let totalCarsOwned: Int
    let currentCarsOwner: Int
    let totalChecksPerformed: Int
    let memberSince: String
}

struct Car: Codable, Identifiable {
    let id: String
    let vin: String
    let make: String
    let model: String
    let year: Int
    let color: String?
    let engineType: String?
    let transmission: String?
    let fuelType: String?
    let currentMileage: Int
    let status: String
    let riskScore: Int
    let riskLevel: String
    let ownershipDocumentUrl: String?
    let mileageUnit: String?
    let description: String?
    let isVerified: Bool
    let verifiedAt: String?
    let verificationNotes: String?
    let createdAt: String
    let updatedAt: String
}

struct VehicleCheck: Codable, Identifiable {
    let id: String
    let vin: String
    let checkType: String?
    let createdAt: String
    let car: Car?
}

struct Ownership: Codable {
    let startedAt: String
    let endedAt: String?
    let isCurrent: Bool
}

struct CarHistoryItem: Codable, Identifiable {
    let id: String
    let vin: String
    let make: String
    let model: String
    let year: Int
    let status: String
    let ownership: Ownership
}

struct CarEvent: Codable, Identifiable {
    let id: String
    let carId: String
    let eventType: String
    let severity: String?
    let description: String?
    let mileage: Int?
    let location: String?
    let cost: String?
    let verifiedByIot: Bool?
    let documentUrl: String?
    let eventDate: String
    let createdAt: String
}

struct ReportRecommendation: Codable {
    let severity: String
    let message: String
}

struct CarReport: Codable {
    let reportType: String
    let generatedAt: String
    let car: Car
    let events: [CarEvent]?
    let recommendations: [ReportRecommendation]?
}
