//
//  MainTabView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @StateObject private var profileViewModel = ProfileViewModel()
    
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("VIN Search", systemImage: "car.fill")
                }
            
            AddCarView()
                .environmentObject(profileViewModel)
                .tabItem {
                    Label("Add Car", systemImage: "plus.circle.fill")
                }
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
        }
    }
}

#Preview {
    MainTabView()
        .environmentObject(AuthViewModel())
}
