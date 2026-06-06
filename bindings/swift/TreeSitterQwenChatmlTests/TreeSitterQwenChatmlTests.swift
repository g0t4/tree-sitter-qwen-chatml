import XCTest
import SwiftTreeSitter
import TreeSitterQwenChatml

final class TreeSitterQwenChatmlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_qwen_chatml())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Qwen ChatML grammar")
    }
}
