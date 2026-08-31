export interface LanguageOption {
  /** Value used both as our internal identifier and sent to the backend for AI code review. */
  value: string;
  label: string;
  /** Monaco's language id for syntax highlighting — usually matches `value`, but not always (bash -> shell). */
  monacoId: string;
  defaultCode: string;
}

export const LANGUAGES: LanguageOption[] = [
  { value: 'python', label: 'Python', monacoId: 'python', defaultCode: 'print("Hello, Code Vault Max!")\n' },
  { value: 'javascript', label: 'JavaScript', monacoId: 'javascript', defaultCode: 'console.log("Hello, Code Vault Max!");\n' },
  { value: 'typescript', label: 'TypeScript', monacoId: 'typescript', defaultCode: 'const message: string = "Hello, Code Vault Max!";\nconsole.log(message);\n' },
  { value: 'java', label: 'Java', monacoId: 'java', defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Code Vault Max!");\n  }\n}\n' },
  { value: 'c', label: 'C', monacoId: 'c', defaultCode: '#include <stdio.h>\n\nint main() {\n  printf("Hello, Code Vault Max!\\n");\n  return 0;\n}\n' },
  { value: 'cpp', label: 'C++', monacoId: 'cpp', defaultCode: '#include <iostream>\n\nint main() {\n  std::cout << "Hello, Code Vault Max!" << std::endl;\n  return 0;\n}\n' },
  { value: 'csharp', label: 'C#', monacoId: 'csharp', defaultCode: 'System.Console.WriteLine("Hello, Code Vault Max!");\n' },
  { value: 'go', label: 'Go', monacoId: 'go', defaultCode: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, Code Vault Max!")\n}\n' },
  { value: 'php', label: 'PHP', monacoId: 'php', defaultCode: '<?php\necho "Hello, Code Vault Max!";\n' },
  { value: 'ruby', label: 'Ruby', monacoId: 'ruby', defaultCode: 'puts "Hello, Code Vault Max!"\n' },
  { value: 'sql', label: 'SQL', monacoId: 'sql', defaultCode: 'SELECT \'Hello, Code Vault Max!\' AS message;\n' },
  { value: 'bash', label: 'Bash', monacoId: 'shell', defaultCode: 'echo "Hello, Code Vault Max!"\n' },
];
