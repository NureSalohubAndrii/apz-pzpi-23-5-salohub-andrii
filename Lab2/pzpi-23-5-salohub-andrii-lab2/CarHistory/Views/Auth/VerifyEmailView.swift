//
//  VerifyEmailView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 05.05.2026.
//

import SwiftUI

struct VerifyEmailView: View {
    @EnvironmentObject var viewModel: AuthViewModel
    let userId: String
    
    @State private var code = ""
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Email Verification")
                .font(.title)
                .bold()
            
            Text("We have sent a 6-digit code to your email.")
                .multilineTextAlignment(.center)
                .foregroundColor(.gray)
            
            TextField("Code", text: $code)
                .keyboardType(.numberPad)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .font(.title2)
                .multilineTextAlignment(.center)
            
            if !viewModel.errorMessage.isEmpty {
                Text(viewModel.errorMessage)
                    .foregroundColor(.red)
                    .font(.footnote)
            }
            
            Button(action: {
                viewModel.verifyEmail(userId: userId, code: code)
            }) {
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    Text("Verify")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
            }
            
            Spacer()
        }
        .padding()
    }
}

#Preview {
    VerifyEmailView(userId: "test-id")
        .environmentObject(AuthViewModel())
}
