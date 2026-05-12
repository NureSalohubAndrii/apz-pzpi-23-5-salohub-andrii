//
//  RootView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import SwiftUI

struct RootView: View {
    @StateObject private var authViewModel = AuthViewModel()
    @StateObject private var profileViewModel = ProfileViewModel()
    @AppStorage("appTheme") private var appTheme: Int = 0

    var body: some View {
        Group{
            if authViewModel.isAuthenticated {
                MainTabView()
                    .environmentObject(authViewModel)
                    .environmentObject(profileViewModel)
            } else {
                NavigationView {
                    RegisterView()
                }
                .environmentObject(authViewModel)
            }
        }
        .preferredColorScheme(appTheme == 0 ? nil : (appTheme == 1 ? .light : .dark))
        .environment(\.locale, Locale.current)
        .environment(\.calendar, Calendar.current)
        .environment(\.timeZone, TimeZone.current)
    }
    
}

#Preview {
    RootView().environmentObject(ProfileViewModel())
}
