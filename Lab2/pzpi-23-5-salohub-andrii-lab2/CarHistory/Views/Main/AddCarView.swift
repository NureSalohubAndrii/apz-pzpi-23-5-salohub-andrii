//
//  AddCarView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 06.05.2026.
//

import SwiftUI

struct AddCarView: View {
    @StateObject private var viewModel = CarViewModel()
    @EnvironmentObject var profileViewModel: ProfileViewModel
    
    @State private var vin = ""
    @State private var make = ""
    @State private var model = ""
    @State private var yearStr = ""
    
    @State private var engineType = ""
    @State private var transmission = "automatic"
    @State private var fuelType = "petrol"
    
    @State private var mileageStr = ""
    @State private var mileageUnit = "km"
    @State private var color = ""
    @State private var description = ""
    
    @State private var showSuccessAlert = false
    
    let transmissions = ["manual", "automatic", "cvt", "dual-clutch"]
    let fuelTypes = ["petrol", "diesel", "hybrid", "electric", "lpg", "hydrogen"]
    let units = ["km", "mi"]
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Vehicle Identification")) {
                    TextField("VIN Code (17 characters)", text: $vin)
                        .autocapitalization(.allCharacters)
                        .disableAutocorrection(true)
                }
                
                Section(header: Text("Basic Information")) {
                    TextField("Make (e.g. Toyota)", text: $make)
                    TextField("Model (e.g. Camry)", text: $model)
                    TextField("Year (e.g. 2021)", text: $yearStr)
                        .keyboardType(.numberPad)
                    TextField("Color", text: $color)
                }
                
                Section(header: Text("Technical Specifications")) {
                    TextField("Engine Type (e.g. 2.5L)", text: $engineType)
                    
                    Picker("Transmission", selection: $transmission) {
                        ForEach(transmissions, id: \.self) { type in
                            Text(type.capitalized).tag(type)
                        }
                    }
                    
                    Picker("Fuel Type", selection: $fuelType) {
                        ForEach(fuelTypes, id: \.self) { type in
                            Text(type.capitalized).tag(type)
                        }
                    }
                }
                
                Section(header: Text("Mileage & Condition")) {
                    HStack {
                        TextField("Current Mileage", text: $mileageStr)
                            .keyboardType(.numberPad)
                        
                        Picker("", selection: $mileageUnit) {
                            ForEach(units, id: \.self) { unit in
                                Text(unit.uppercased()).tag(unit)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        .frame(width: 100)
                    }
                    
                    ZStack(alignment: .topLeading) {
                        if description.isEmpty {
                            Text("Description (Optional)")
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
                
                Button(action: submitForm) {
                    if viewModel.isLoading {
                        ProgressView().frame(maxWidth: .infinity, alignment: .center)
                    } else {
                        Text("Add Vehicle")
                            .frame(maxWidth: .infinity, alignment: .center)
                            .bold()
                            .foregroundColor(.blue)
                    }
                }
                .disabled(vin.isEmpty || make.isEmpty || model.isEmpty || yearStr.isEmpty)
            }
            .navigationTitle("Add Car")
            .alert(isPresented: $showSuccessAlert) {
                Alert(
                    title: Text("Success"),
                    message: Text("Car has been successfully added to your garage."),
                    dismissButton: .default(Text("OK")) {
                        resetForm()
                        profileViewModel.fetchMyCars()
                    }
                )
            }
        }
    }
    
    private func submitForm() {
        let year = Int(yearStr) ?? 2000
        let mileage = Int(mileageStr) ?? 0
        
        viewModel.addCar(
            vin: vin,
            make: make,
            model: model,
            year: year,
            mileage: mileage,
            mileageUnit: mileageUnit,
            color: color,
            engineType: engineType,
            transmission: transmission,
            fuelType: fuelType,
            description: description
        ) { success in
            if success {
                self.showSuccessAlert = true
            }
        }
    }
    
    private func resetForm() {
        vin = ""; make = ""; model = ""; yearStr = ""; mileageStr = ""; color = ""; engineType = ""; description = ""
    }
}
