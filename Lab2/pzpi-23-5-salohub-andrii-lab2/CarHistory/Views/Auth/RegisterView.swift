//
//  RegisterView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var viewModel: AuthViewModel
    
    @State private var email = ""
    @State private var password = ""
    @State private var firstName = ""
    @State private var lastName = ""
    
    @State private var navigateToVerify = false
    @State private var savedUserId = ""
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Register")
                .font(.largeTitle)
                .bold()
            
            TextField("First Name", text: $firstName)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            TextField("Last Name", text: $lastName)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            TextField("Email", text: $email)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            SecureField("Password (min 8 characters)", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            if !viewModel.errorMessage.isEmpty {
                Text(viewModel.errorMessage)
                    .foregroundColor(.red)
                    .font(.footnote)
            }
            
            Button(action: {
                viewModel.register(email: email, password: password, firstName: firstName, lastName: lastName) { userId in
                    if let userId = userId {
                        self.savedUserId = userId
                        self.navigateToVerify = true
                    }
                }
            }) {
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    Text("Create Account")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
            }
            
            NavigationLink(destination: VerifyEmailView(userId: savedUserId), isActive: $navigateToVerify) { EmptyView() }
            
            Spacer()
            
            NavigationLink("Already have an account? Log in", destination: LoginView())
                .foregroundColor(.blue)
        }
        .padding()
        .navigationBarHidden(true)
    }
}

#Preview {
    let auth = AuthViewModel()
    return NavigationView {
        RegisterView()
            .environmentObject(auth)
    }
    .environmentObject(auth)
}
