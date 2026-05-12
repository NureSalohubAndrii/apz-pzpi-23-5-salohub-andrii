//
//  ReportView.swift
//  CarHistory
//
//  Created by Andrii Salohub on 06.05.2026.
//

import SwiftUI

struct ReportView: View {
    let vin: String
    @StateObject private var viewModel = ReportAndEventViewModel()
    
    var body: some View {
        List {
            if viewModel.isLoading {
                ProgressView("Generating Report...")
                    .frame(maxWidth: .infinity, alignment: .center)
            } else if let report = viewModel.report {
                
                if let recs = report.recommendations, !recs.isEmpty {
                    Section(header: Text("Recommendations")) {
                        ForEach(recs, id: \.message) { rec in
                            HStack(alignment: .top) {
                                Image(systemName: iconForSeverity(rec.severity))
                                    .foregroundColor(colorForSeverity(rec.severity))
                                Text(rec.message)
                                    .font(.subheadline)
                                    .bold()
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }
                
                if let events = report.events, !events.isEmpty {
                    Section(header: Text("Vehicle History Events")) {
                        ForEach(events) { event in
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Text(event.eventType.replacingOccurrences(of: "_", with: " ").capitalized)
                                        .font(.headline)
                                        .foregroundColor(event.eventType == "mileage_tampering" || event.eventType == "accident" ? .red : .primary)
                                    Spacer()
                                    Text(DateFormatHelper.format(event.eventDate))
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                                
                                if let desc = event.description {
                                    Text(desc)
                                        .font(.subheadline)
                                }
                                
                                HStack {
                                    if let mileage = event.mileage {
                                        Label("\(mileage) km", systemImage: "speedometer")
                                    }
                                    Spacer()
                                    if let cost = event.cost {
                                        Text("Cost: $\(cost)")
                                            .foregroundColor(.secondary)
                                    }
                                }
                                .font(.caption)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                } else {
                    Section {
                        Text("No events found for this vehicle. Clean history.")
                            .foregroundColor(.green)
                    }
                }
            } else if !viewModel.errorMessage.isEmpty {
                Text(viewModel.errorMessage)
                    .foregroundColor(.red)
            }
        }
        .listStyle(InsetGroupedListStyle())
        .navigationTitle("Full Report")
        .onAppear {
            viewModel.generateReport(vin: vin)
        }
    }
    
    private func colorForSeverity(_ severity: String) -> Color {
        switch severity {
        case "critical": return .red
        case "high": return .orange
        case "medium": return .yellow
        default: return .green
        }
    }
    
    private func iconForSeverity(_ severity: String) -> String {
        switch severity {
        case "critical": return "exclamationmark.octagon.fill"
        case "high": return "exclamationmark.triangle.fill"
        case "medium": return "exclamationmark.circle.fill"
        default: return "checkmark.seal.fill"
        }
    }
}
