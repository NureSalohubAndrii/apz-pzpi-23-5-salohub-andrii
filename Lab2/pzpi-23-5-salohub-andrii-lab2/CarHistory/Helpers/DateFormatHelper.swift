//
//  DateFormatHelper.swift
//  CarHistory
//
//  Created by Andrii Salohub on 11.05.2026.
//

import Foundation

struct DateFormatHelper {
    static func format(_ isoString: String, style: DateFormatter.Style = .medium) -> String {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        
        let date = iso.date(from: isoString) ?? ISO8601DateFormatter().date(from: isoString)
        guard let date else { return isoString }
        
        let df = DateFormatter()
        df.dateStyle = style
        df.timeStyle = .none
        df.locale = Locale.current         
        df.timeZone = TimeZone.current
        return df.string(from: date)
    }
    
    static func formatWithTime(_ isoString: String) -> String {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        
        let date = iso.date(from: isoString) ?? ISO8601DateFormatter().date(from: isoString)
        guard let date else { return isoString }
        
        let df = DateFormatter()
        df.dateStyle = .medium
        df.timeStyle = .short
        df.locale = Locale.current
        df.timeZone = TimeZone.current
        return df.string(from: date)
    }
}
