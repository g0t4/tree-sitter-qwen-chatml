// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterQwenChatml",
    products: [
        .library(name: "TreeSitterQwenChatml", targets: ["TreeSitterQwenChatml"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterQwenChatml",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterQwenChatmlTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterQwenChatml",
            ],
            path: "bindings/swift/TreeSitterQwenChatmlTests"
        )
    ],
    cLanguageStandard: .c11
)
