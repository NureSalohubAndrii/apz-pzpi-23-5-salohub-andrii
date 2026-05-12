//
//  AuthViewModel.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import Foundation
import SwiftUI
import Combine

class AuthViewModel: ObservableObject {
    @Published var isAuthenticated: Bool = false
    @Published var currentUser: User? = nil
    
    @Published var isLoading: Bool = false
    @Published var errorMessage: String = ""
    
    @AppStorage("jwt_token") var token: String = ""
    
    init(){
        checkAuth()
    }
    
    func checkAuth(){
        if !token.isEmpty {
            self.isAuthenticated = true
        }
        
        refreshToken { success in
            DispatchQueue.main.async {
                if success {
                    self.fetchCurrentUser()
                } else {
                    self.logout()
                }
            }
        }
    }
    
    func logout(){
        token = ""
        isAuthenticated = false
        currentUser = nil
    }
    
    func register(email: String, password: String, firstName: String, lastName: String, completion: @escaping(String?) -> Void){
        isLoading = true
        errorMessage = ""
        
        let url = URL(string: "\(Constants.baseURL)/auth/register")!
        let body: [String: Any] = ["email": email, "password": password, "firstName": firstName, "lastName": lastName]
        
        performRequest(url: url, body: body, responseType: ApiResponse<RegisterData>.self) { result in
            DispatchQueue.main.async {
                self.isLoading = false
                switch result {
                case .success(let response):
                    if response.success, let userId = response.data?.userId {
                        completion(userId)
                    } else {
                        self.errorMessage = response.message ?? "Registration error"
                        completion(nil)
                    }
                case .failure(let error):
                    self.errorMessage = error.localizedDescription
                    completion(nil)
                }
            }
        }
    }
    
    func verifyEmail(userId: String, code: String) {
        isLoading = true
        let url = URL(string: "\(Constants.baseURL)/auth/verify-email/\(userId)")!
        let body: [String: Any] = ["code": code]
        
        performRequest(url: url, body: body, responseType: ApiResponse<AuthData>.self) { result in
            DispatchQueue.main.async {
                self.isLoading = false
                switch result {
                case .success(let response):
                    if response.success, let data = response.data {
                        self.token = data.token
                        self.currentUser = data.user
                        self.isAuthenticated = true
                    } else {
                        self.errorMessage = response.message ?? "Wrong code!"
                    }
                case .failure(let error):
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
        
    func login(email: String, pass: String) {
        isLoading = true
        let url = URL(string: "\(Constants.baseURL)/auth/login")!
        let body: [String: Any] = ["email": email, "password": pass]
        
        performRequest(url: url, body: body, responseType: ApiResponse<AuthData>.self) { result in
            DispatchQueue.main.async {
                self.isLoading = false
                switch result {
                case .success(let response):
                    if response.success, let data = response.data {
                        self.token = data.token
                        self.currentUser = data.user
                        self.isAuthenticated = true
                    } else {
                        self.errorMessage = response.message ?? "Login error"
                    }
                case .failure(let error):
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
    
    private func fetchCurrentUser() {
        guard let url = URL(string: "\(Constants.baseURL)/auth/me") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let data = data {
                do {
                    let decoded = try JSONDecoder().decode(ApiResponse<User>.self, from: data)
                    DispatchQueue.main.async {
                        if decoded.success, let user = decoded.data {
                            self.currentUser = user
                            self.isAuthenticated = true
                        } else {
                            self.logout()
                        }
                    }
                } catch {
                    print("Error parsing user profile")
                }
            }
        }.resume()
    }
    
    private func refreshToken(completion: @escaping (Bool) -> Void) {
        guard let url = URL(string: "\(Constants.baseURL)/auth/refresh") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let _ = error {
                completion(false)
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 401 {
                completion(false)
                return
            }
            
            guard let data = data else {
                completion(false)
                return
            }
            
            do {
                let decoded = try JSONDecoder().decode(ApiResponse<RefreshData>.self, from: data)
                if decoded.success, let newToken = decoded.data?.token {
                    DispatchQueue.main.async {
                        self.token = newToken
                    }
                    completion(true)
                } else {
                    completion(false)
                }
            } catch {
                completion(false)
            }
        }.resume()
    }
    
    private func performRequest<T: Codable>(url: URL, body: [String: Any], responseType: T.Type, completion: @escaping (Result<T, Error>) -> Void){
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
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
