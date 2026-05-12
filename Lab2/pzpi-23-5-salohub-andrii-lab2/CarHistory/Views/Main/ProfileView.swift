//
//  ProfileView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var profileViewModel: ProfileViewModel
    
    @State private var showEditProfile = false
    @State private var showDeleteAlert = false
    @State private var deleteErrorMessage: String? = nil
    
    @AppStorage("appTheme") private var appTheme: Int  = 0
    
    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                            .frame(width: 60, height: 60)
                            .foregroundColor(.gray)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("\(authViewModel.currentUser?.firstName ?? "") \(authViewModel.currentUser?.lastName ?? "")")
                                .font(.headline)
                            Text(authViewModel.currentUser?.email ?? "")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                        .padding(.leading, 8)
                    }
                    .padding(.vertical, 8)
                    
                    Button("Edit Profile") {
                        showEditProfile = true
                    }
                }
                
                Section(header: Text("Appearance")){
                    Picker("Theme", selection: $appTheme) {
                        Text("System").tag(0)
                        Text("Light").tag(1)
                        Text("Dark").tag(2)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }
                
                if let stats = profileViewModel.stats {
                    Section(header: Text("Activity Stats")) {
                        HStack {
                            Text("Total Cars Owned")
                            Spacer()
                            Text("\(stats.totalCarsOwned)")
                                .bold()
                        }
                        HStack {
                            Text("Checks Performed")
                            Spacer()
                            Text("\(stats.totalChecksPerformed)")
                                .bold()
                        }
                    }
                }
                
                Section(header: Text("My Garage")) {
                    if profileViewModel.myCars.isEmpty {
                        Text("No cars currently owned.")
                            .foregroundColor(.gray)
                    } else {
                        ForEach(profileViewModel.myCars) { car in
                            NavigationLink(destination: CarDetailView(car: car).environmentObject(profileViewModel)) {
                                VStack(alignment: .leading) {
                                    Text("\(car.make) \(car.model) (\(String(car.year)))")
                                        .font(.headline)
                                    Text("VIN: \(car.vin)")
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                            }
                        }
                    }
                }
                
                Section(header: Text("History & Activity")) {
                    NavigationLink(destination: CarOwnershipHistoryView(viewModel: profileViewModel)) {
                        Label("Ownership History", systemImage: "clock.arrow.circlepath")
                    }
                    
                    NavigationLink(destination: CheckHistoryView(viewModel: profileViewModel)) {
                        Label("VIN Check History", systemImage: "doc.text.magnifyingglass")
                    }
                }
                
                Section {
                    Button(action: {
                        authViewModel.logout()
                    }) {
                        Text("Log Out")
                            .foregroundColor(.blue)
                    }
                    
                    Button(action: {
                        showDeleteAlert = true
                    }) {
                        Text("Delete Account")
                            .foregroundColor(.red)
                    }
                }
            }
            .listStyle(InsetGroupedListStyle())
            .navigationTitle("Profile")
            .onAppear {
                profileViewModel.fetchStats()
                profileViewModel.fetchMyCars()
            }
            .sheet(isPresented: $showEditProfile) {
                EditProfileView()
                    .environmentObject(authViewModel)
            }
            .alert(isPresented: $showDeleteAlert) {
                Alert(
                    title: Text("Delete Account"),
                    message: Text(deleteErrorMessage ?? "Are you sure you want to permanently delete your account? This action cannot be undone."),
                    primaryButton: .destructive(Text("Delete")) {
                        profileViewModel.deleteAccount { success, message in
                            if success {
                                authViewModel.logout()
                            } else {
                                deleteErrorMessage = message ?? "Cannot delete account."
                                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                                    showDeleteAlert = true
                                }
                            }
                        }
                    },
                    secondaryButton: .cancel(Text("Cancel")) {
                        deleteErrorMessage = nil
                    }
                )
            }
        }
    }
}
