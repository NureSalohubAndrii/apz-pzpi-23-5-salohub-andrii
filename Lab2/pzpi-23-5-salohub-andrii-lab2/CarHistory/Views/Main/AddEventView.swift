//
//  AddEventView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 06.05.2026.
//

import SwiftUI

struct AddEventView: View {
    let carId: String
    @StateObject private var viewModel = ReportAndEventViewModel()
    @Environment(\.presentationMode) var presentationMode
    
    @State private var eventType = "service"
    @State private var severity = "low"
    @State private var eventDate = Date()
    @State private var mileageStr = ""
    @State private var description = ""
    @State private var costStr = ""
    
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    let eventTypes = ["service", "repair", "inspection", "accident", "mileage_update", "other"]
    let severities = ["low", "medium", "high", "critical"]
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Event Details")) {
                    Picker("Event Type", selection: $eventType) {
                        ForEach(eventTypes, id: \.self) { type in
                            Text(type.capitalized).tag(type)
                        }
                    }
                    
                    Picker("Severity", selection: $severity) {
                        ForEach(severities, id: \.self) { sev in
                            Text(sev.capitalized).tag(sev)
                        }
                    }
                    
                    DatePicker("Date", selection: $eventDate, displayedComponents: .date)
                }
                
                Section(header: Text("Information")) {
                    TextField("Mileage (km)", text: $mileageStr)
                        .keyboardType(.numberPad)
                    
                    TextField("Cost ($)", text: $costStr)
                        .keyboardType(.decimalPad)
                    
                    ZStack(alignment: .topLeading) {
                        if description.isEmpty {
                            Text("Description (What was done?)")
                                .foregroundColor(Color(UIColor.placeholderText))
                                .padding(.top, 8)
                                .padding(.leading, 4)
                        }
                        TextEditor(text: $description)
                            .frame(minHeight: 80)
                    }
                }
                
                if !viewModel.errorMessage.isEmpty {
                    Text(viewModel.errorMessage)
                        .foregroundColor(.red)
                        .font(.footnote)
                }
                
                Button(action: submitEvent) {
                    if viewModel.isLoading {
                        ProgressView().frame(maxWidth: .infinity, alignment: .center)
                    } else {
                        Text("Save Event")
                            .frame(maxWidth: .infinity, alignment: .center)
                            .foregroundColor(.blue)
                            .bold()
                    }
                }
            }
            .navigationTitle("Add History Event")
            .navigationBarItems(leading: Button("Cancel") {
                presentationMode.wrappedValue.dismiss()
            })
            .alert(isPresented: $showAlert) {
                Alert(
                    title: Text("Event Status"),
                    message: Text(alertMessage),
                    dismissButton: .default(Text("OK")) {
                        if alertMessage == "Event added successfully!" {
                            presentationMode.wrappedValue.dismiss()
                        }
                    }
                )
            }
        }
    }
    
    private func submitEvent() {
        let mileage = Int(mileageStr)
        
        viewModel.addEvent(
            carId: carId,
            eventType: eventType,
            eventDate: eventDate,
            mileage: mileage,
            severity: severity,
            description: description,
            cost: costStr
        ) { success in
            if success {
                alertMessage = "Event added successfully!"
                showAlert = true
            } else {
                alertMessage = viewModel.errorMessage
                showAlert = true
            }
        }
    }
}
