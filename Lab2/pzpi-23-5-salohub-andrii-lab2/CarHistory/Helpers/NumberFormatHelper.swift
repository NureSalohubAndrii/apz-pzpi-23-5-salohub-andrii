//
//  NumberFormatHelper.swift
//  CarHistory
//
//  Created by Andrii Salohub on 11.05.2026.
//

import Foundation

struct NumberFormatHelper {
    static func formatMileage(_ value: Int, unit: String = "km") -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.locale = Locale.current
        let formatted = formatter.string(from: NSNumber(value: value)) ?? "\(value)"
        return "\(formatted) \(unit)"
    }
    
    static func formatCost(_ value: String) -> String {
        guard let number = Double(value) else { return value }
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = Locale.current
        return formatter.string(from: NSNumber(value: number)) ?? value
    }
}
