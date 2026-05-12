//
//  HomeView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel = CarViewModel()
    @EnvironmentObject var profileViewModel: ProfileViewModel
    @State private var vinCode = ""
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    TextField("Enter 17-character VIN", text: $vinCode)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.horizontal)
                        .autocapitalization(.allCharacters)
                        .disableAutocorrection(true)
                    
                    Button(action: {
                        viewModel.searchCarByVIN(vin: vinCode)
                    }) {
                        if viewModel.isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.blue)
                                .cornerRadius(10)
                        } else {
                            Text("Search History")
                                .bold()
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(10)
                        }
                    }
                    .padding(.horizontal)
                    .disabled(vinCode.count < 5)
                    
                    if !viewModel.errorMessage.isEmpty {
                        Text(viewModel.errorMessage)
                            .foregroundColor(.red)
                            .padding()
                    }
                    
                    if let car = viewModel.searchedCar {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Vehicle Found")
                                .font(.headline)
                                .foregroundColor(.green)
                            
                            NavigationLink(destination: CarDetailView(car: car).environmentObject(profileViewModel)) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 5) {
                                        Text("\(car.make) \(car.model) (\(String(car.year)))")
                                            .font(.title3)
                                            .bold()
                                            .foregroundColor(.primary)
                                        
                                        Text("VIN: \(car.vin)")
                                            .font(.caption)
                                            .foregroundColor(.gray)
                                        
                                        Text("Risk Level: \(car.riskLevel.capitalized)")
                                            .font(.footnote)
                                            .foregroundColor(car.riskLevel == "low" ? .green : (car.riskLevel == "medium" ? .orange : .red))
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right")
                                        .foregroundColor(.gray)
                                }
                                .padding()
                                .background(Color(UIColor.secondarySystemBackground))
                                .cornerRadius(12)
                            }
                        }
                        .padding()
                    }
                    
                    Spacer()
                }
                .padding(.top)
            }
            .navigationTitle("VIN Search")
        }
    }
}
