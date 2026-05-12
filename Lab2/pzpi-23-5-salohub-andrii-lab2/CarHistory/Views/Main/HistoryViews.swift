//
//  HistoryViews.swift
//  CarHistory
//
//  Created by Andrii Salohub on 06.05.2026.
//

import SwiftUI

struct CarOwnershipHistoryView: View {
    @ObservedObject var viewModel: ProfileViewModel
    
    var body: some View {
        List {
            if viewModel.carHistory.isEmpty {
                Text("No ownership history found.")
                    .foregroundColor(.gray)
            } else {
                ForEach(viewModel.carHistory) { item in
                    VStack(alignment: .leading, spacing: 5) {
                        Text("\(item.make) \(item.model) (\(String(item.year)))")
                            .font(.headline)
                        
                        Text("VIN: \(item.vin)")
                            .font(.caption)
                            .foregroundColor(.gray)
                        
                        HStack {
                            Text(DateFormatHelper.format(item.ownership.startedAt))
                            Text("-")
                            if let endedAt = item.ownership.endedAt, !item.ownership.isCurrent {
                                Text(DateFormatHelper.format(endedAt))
                            } else {
                                Text("Present")
                                    .foregroundColor(.green)
                            }
                        }
                        .font(.footnote)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
        .navigationTitle("Ownership History")
        .onAppear {
            viewModel.fetchCarHistory()
        }
    }
}

struct CheckHistoryView: View {
    @ObservedObject var viewModel: ProfileViewModel
    
    var body: some View {
        List {
            if viewModel.checkHistory.isEmpty {
                Text("No checks performed yet.")
                    .foregroundColor(.gray)
            } else {
                ForEach(viewModel.checkHistory) { check in
                    VStack(alignment: .leading, spacing: 5) {
                        Text(check.car?.make != nil ? "\(check.car!.make) \(check.car!.model)" : "Unknown Vehicle")
                            .font(.headline)
                        
                        Text("VIN: \(check.vin)")
                            .font(.caption)
                            .foregroundColor(.gray)
                        
                        HStack {
                            Text(check.checkType?.capitalized ?? "Standard Check")
                            Spacer()
                            Text(DateFormatHelper.format(check.createdAt))
                                .foregroundColor(.gray)
                        }
                        .font(.footnote)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
        .navigationTitle("Check History")
        .onAppear {
            viewModel.fetchCheckHistory()
        }
    }
}
