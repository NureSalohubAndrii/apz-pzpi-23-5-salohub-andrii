//
//  ProfileViewModel.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import Foundation
import SwiftUI
import Combine

@MainActor
class ProfileViewModel: ObservableObject {
    @Published var stats: UserStats? = nil
    @Published var myCars: [Car] = []
    @Published var isLoading: Bool = false
    @Published var errorMessage: String = ""
    @Published var carHistory: [CarHistoryItem] = []
    @Published var checkHistory: [VehicleCheck] = []
    
    @AppStorage("jwt_token") var token: String = ""
    
    func fetchStats(){
        guard let url = URL(string: "\(Constants.baseURL)/users/stats") else {return}
        
        performRequest(url: url, method: "GET", body: nil, responseType: ApiResponse<UserStats>.self) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let response):
                    if response.success {
                        self.stats = response.data
                    }
                case .failure(let error):
                    print("Error fetching stats: \(error.localizedDescription)")
                }
            }
        }
    }
    
    func updateProfile(firstName: String, lastName: String, completion: @escaping (Bool) -> Void) {
        isLoading = true
        guard let url = URL(string: "\(Constants.baseURL)/users/profile") else { return }
        let body: [String: Any] = ["firstName": firstName, "lastName": lastName]
        
        performRequest(url: url, method: "PUT", body: body, responseType: ApiResponse<User>.self) { result in
            DispatchQueue.main.async {
                self.isLoading = false
                switch result {
                case .success(let response):
                    completion(response.success)
                case .failure(let error):
                    self.errorMessage = error.localizedDescription
                    completion(false)
                }
            }
        }
    }
        
    func fetchMyCars() {
        guard let url = URL(string: "\(Constants.baseURL)/users/my-cars") else { return }
        performRequest(url: url, method: "GET", body: nil, responseType: ApiResponse<[Car]>.self) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let response):
                    if response.success {
                        self.myCars = response.data ?? []
                    }
                case .failure(let error):
                    print("Error fetching cars: \(error.localizedDescription)")
                }
            }
        }
    }
    
    func deleteAccount(completion: @escaping (Bool, String?) -> Void) {
        isLoading = true
        guard let url = URL(string: "\(Constants.baseURL)/users/account") else { return }
        
        performRequest(url: url, method: "DELETE", body: nil, responseType: ApiResponse<[String: String]>.self) { result in
            DispatchQueue.main.async {
                self.isLoading = false
                switch result {
                case .success(let response):
                    completion(response.success, response.message)
                case .failure(let error):
                    completion(false, error.localizedDescription)
                }
            }
        }
    }
    
    func fetchCarHistory() {
        guard let url = URL(string: "\(Constants.baseURL)/users/my-cars/history") else { return }
        performRequest(url: url, method: "GET", body: nil, responseType: ApiResponse<[CarHistoryItem]>.self) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let response):
                    if response.success {
                        self.carHistory = response.data ?? []
                    }
                case .failure(let error):
                    print("Error fetching car history: \(error.localizedDescription)")
                }
            }
        }
    }
        
    func fetchCheckHistory() {
        guard let url = URL(string: "\(Constants.baseURL)/users/check-history?limit=50") else { return }
        performRequest(url: url, method: "GET", body: nil, responseType: ApiResponse<[VehicleCheck]>.self) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let response):
                    if response.success {
                        self.checkHistory = response.data ?? []
                    }
                case .failure(let error):
                    print("Error fetching check history: \(error.localizedDescription)")
                }
            }
        }
    }
    
    private func performRequest<T: Codable>(url: URL, method: String, body: [String: Any]?, responseType: T.Type, completion: @escaping (Result<T, Error>) -> Void) {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        if let body = body {
            request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        }
        
        URLSession.shared.dataTask(with: request){ data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            guard let data = data else {
                completion(.failure(NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data"])))
                return
            }
            do {
                let decoded = try JSONDecoder().decode(T.self, from: data)
                completion(.success(decoded))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}
