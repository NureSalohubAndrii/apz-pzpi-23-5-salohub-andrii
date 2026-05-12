//
//  EditProfileView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import SwiftUI

struct EditProfileView: View {
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var profileViewModel = ProfileViewModel()
    
    @State private var firstName: String = ""
    @State private var lastName: String = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Personal Information")) {
                    TextField("First Name", text: $firstName)
                    TextField("Last Name", text: $lastName)
                }
                
                if !profileViewModel.errorMessage.isEmpty {
                    Text(profileViewModel.errorMessage)
                        .foregroundColor(.red)
                        .font(.footnote)
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarItems(
                leading: Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button("Save") {
                    profileViewModel.updateProfile(firstName: firstName, lastName: lastName) { success in
                        if success {
                            presentationMode.wrappedValue.dismiss()
                        }
                    }
                }
            )
            .onAppear {
                self.firstName = authViewModel.currentUser?.firstName ?? ""
                self.lastName = authViewModel.currentUser?.lastName ?? ""
            }
            .overlay(
                Group {
                    if profileViewModel.isLoading {
                        ProgressView().scaleEffect(1.5)
                    }
                }
            )
        }
    }
}
