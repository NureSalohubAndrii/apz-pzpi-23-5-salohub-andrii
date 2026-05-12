//
//  ReportAndEventViewModel.swift
//  CarHistory
//
//  Created by Andrii Salohub on 06.05.2026.
//

import Foundation
import SwiftUI
import Combine

class ReportAndEventViewModel: ObservableObject {
    @Published var report: CarReport? = nil
    @Published var carEvents: [CarEvent] = []
    
    @Published var isLoading: Bool = false
    @Published var errorMessage: String = ""
    
    @AppStorage("jwt_token") var token: String = ""
    
    func generateReport(vin: String, type: String = "extended") {
        isLoading = true
        errorMessage = ""
        
        guard let url = URL(string: "\(Constants.baseURL)/reports/\(vin)?type=\(type)") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                self.isLoading = false
                if let error = error {
                    self.errorMessage = error.localizedDescription
                    return
                }
                guard let data = data else { return }
                
                do {
                    let decoded = try JSONDecoder().decode(ApiResponse<CarReport>.self, from: data)
                    if decoded.success {
                        self.report = decoded.data
                    } else {
                        self.errorMessage = decoded.message ?? "Error generating report"
                    }
                } catch {
                    print(error)
                    self.errorMessage = "Failed to parse report."
                }
            }
        }.resume()
    }
    
    func addEvent(carId: String, eventType: String, eventDate: Date, mileage: Int?, severity: String, description: String, cost: String, completion: @escaping (Bool) -> Void) {
        isLoading = true
        errorMessage = ""
        
        guard let url = URL(string: "\(Constants.baseURL)/events") else { return }
        
        var body: [String: Any] = [
            "carId": carId,
            "eventType": eventType,
            "eventDate": ISO8601DateFormatter().string(from: eventDate)
        ]
        
        if let m = mileage { body["mileage"] = m }
        if !severity.isEmpty { body["severity"] = severity }
        if !description.isEmpty { body["description"] = description }
        if !cost.isEmpty { body["cost"] = cost }
        
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
                
                guard let data = data else { return }
                do {
                    let decoded = try JSONDecoder().decode(ApiResponse<CarEvent>.self, from: data)
                    if decoded.success {
                        completion(true)
                    } else {
                        self.errorMessage = decoded.message ?? "Error adding event"
                        completion(false)
                    }
                } catch {
                    if let errorDict = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                       let errorMsg = errorDict["error"] as? String {
                        self.errorMessage = errorMsg
                    } else {
                        self.errorMessage = "Failed to add event."
                    }
                    completion(false)
                }
            }
        }.resume()
    }
}
