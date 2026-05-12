//
//  CarDetailView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 06.05.2026.
//

import SwiftUI

struct CarDetailView: View {
    let car: Car
    
    @EnvironmentObject var profileViewModel: ProfileViewModel
    @State private var showAddEventSheet = false
    
    var isOwner: Bool {
        profileViewModel.myCars.contains(where: {$0.id == car.id})
    }
    
    var body: some View {
        List {
            if car.isVerified {
                Section {
                    HStack {
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(.blue)
                        Text("Verified Vehicle")
                            .bold()
                            .foregroundColor(.blue)
                    }
                }
            }
            
            Section(header: Text("Basic Info")) {
                DetailRow(title: "Make", value: car.make)
                DetailRow(title: "Model", value: car.model)
                DetailRow(title: "Year", value: "\(car.year)")
                DetailRow(title: "VIN", value: car.vin)
                DetailRow(title: "Color", value: car.color ?? "Unknown")
            }
            
            Section(header: Text("Technical Specs")) {
                DetailRow(title: "Engine", value: car.engineType ?? "Not specified")
                DetailRow(title: "Transmission", value: car.transmission?.capitalized ?? "Not specified")
                DetailRow(title: "Fuel Type", value: car.fuelType?.capitalized ?? "Not specified")
            }
            
            Section(header: Text("Condition & Safety")) {
                DetailRow(title: "Mileage", value: "\(car.currentMileage) \(car.mileageUnit ?? "km")")
                DetailRow(title: "Status", value: car.status.capitalized)
                
                HStack {
                    Text("Risk Level")
                        .foregroundColor(.gray)
                    Spacer()
                    Text(car.riskLevel.capitalized)
                        .bold()
                        .foregroundColor(car.riskLevel == "low" ? .green : (car.riskLevel == "medium" ? .orange : .red))
                }
                
                DetailRow(title: "Risk Score", value: "\(car.riskScore) / 100")
            }
            
            if let desc = car.description, !desc.isEmpty {
                Section(header: Text("Notes")) {
                    Text(desc)
                        .font(.body)
                }
            }
            
            Section {
                NavigationLink(destination: ReportView(vin: car.vin)) {
                    HStack {
                        Image(systemName: "doc.text.magnifyingglass")
                            .foregroundColor(.blue)
                        Text("Get Full Vehicle Report")
                            .bold()
                            .foregroundColor(.blue)
                    }
                }
            }
            
            if isOwner {
                Section(footer: Text("As the owner, you can add service records or report incidents.")) {
                    Button(action: {
                        showAddEventSheet = true
                    }) {
                        HStack {
                            Image(systemName: "plus.circle.fill")
                                .foregroundColor(.green)
                            Text("Add Service / Event")
                                .foregroundColor(.green)
                        }
                    }
                }
            }
        }
        .listStyle(InsetGroupedListStyle())
        .navigationTitle("\(car.make) \(car.model)")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showAddEventSheet) {
            AddEventView(carId: car.id)
        }
    }
}

struct DetailRow: View {
    let title: LocalizedStringKey
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .foregroundStyle(.gray)
            Spacer()
            Text(value).bold()
        }
    }
}
