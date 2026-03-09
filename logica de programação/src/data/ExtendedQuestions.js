// Helader function
function q(id, num, nome, enunciado, dica, vgRaw, pyRaw, jsRaw) {
  const parse = (text) => {
    const lines = text.split('\n');
    const ids = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const linhas = [];

    const ordem = [];
    let index = 0;
    for (const line of lines) {
      if (line.trim().length === 0) continue;
      let spaceCount = 0;
      const match = line.match(/^(\s+)/);
      if (match) spaceCount = match[1].length;
      const ind = Math.floor(spaceCount / 2); // 2 spaces = 1 indent
      const cId = ids[index++];
      linhas.push({ id: cId, code: line.trim(), ind });
      ordem.push(cId);
    }
    return { linhas, ordem };
  };
  return {
    id, num, nome, enunciado, dica,
    linhas: { visualg: parse(vgRaw).linhas, python: parse(pyRaw).linhas, js: parse(jsRaw).linhas },
    ordem: { visualg: parse(vgRaw).ordem, python: parse(pyRaw).ordem, js: parse(jsRaw).ordem }
  };
}

// ── M1: Variáveis e Atribuição ──
export const extras_m1 = [
  q('e_m1_1', 5, 'Tipo Lógico', 'Declare uma variável booleana/lógica verdadeira.', 'Lógico em VG, bool em Py.',
    'algoritmo "B"\nvar\n  t: logico\ninicio\n  t <- verdadeiro\nfimalgoritmo',
    't = True', 'let t = true;'),
  q('e_m1_2', 6, 'Tipo Caractere', 'Declare uma string contendo "A".', 'Use aspas.',
    'algoritmo "S"\nvar\n  str: caractere\ninicio\n  str <- "A"\nfimalgoritmo',
    'str = "A"', 'let str = "A";'),
  q('e_m1_3', 7, 'Constante PI', 'Declare uma variável pi valendo 3.14.', 'Use real ou float.',
    'algoritmo "P"\nvar\n  pi: real\ninicio\n  pi <- 3.14\nfimalgoritmo',
    'pi = 3.14', 'const pi = 3.14;'),
  q('e_m1_4', 8, 'Múltiplos Nomes', 'Declare a=1 e b=2 na mesma linha (se aplicável) ou em duas.', 'Atribuições basais.',
    'algoritmo "M"\nvar\n  a, b: inteiro\ninicio\n  a <- 1\n  b <- 2\nfimalgoritmo',
    'a = 1\nb = 2', 'let a = 1, b = 2;'),
  q('e_m1_5', 9, 'Trocando 3 Variáveis', 'Troque A para B, B para C, C para A.', 'Precisa de auxiliar.',
    'algoritmo "T3"\nvar\n  a,b,c,aux: inteiro\ninicio\n  aux <- a\n  a <- b\n  b <- c\n  c <- aux\nfimalgoritmo',
    'aux = a\na = b\nb = c\nc = aux', 'let aux = a;\na = b;\nb = c;\nc = aux;'),
  q('e_m1_6', 10, 'Palavra Final', 'Crie var char com "Fim".', '', 'algoritmo "F"\nvar\n c: caractere\ninicio\n c <- "Fim"\nfimalgoritmo', 'c = "Fim"', 'let c = "Fim";'),
  q('e_m1_7', 11, 'Salário Inicial', 'Inicie s com 1000.50', '', 'algoritmo "S"\nvar\n s: real\ninicio\n s <- 1000.50\nfimalgoritmo', 's = 1000.50', 'let s = 1000.50;'),
  q('e_m1_8', 12, 'Flag Falsa', 'Var logica falsa.', '', 'algoritmo "f"\nvar\n f: logico\ninicio\n f <- falso\nfimalgoritmo', 'f = False', 'let f = false;'),
  q('e_m1_9', 13, 'Duas Strings', 'X="A", Y="B"', '', 'algoritmo "d"\nvar\n x,y: caractere\ninicio\n x<-"A"\n y<-"B"\nfimalgoritmo', 'x="A"\ny="B"', 'let x="A", y="B";'),
  q('e_m1_10', 14, 'Sobrescrita', 'n=5 e depois n=10.', '', 'algoritmo "s"\nvar\n n: inteiro\ninicio\n n<-5\n n<-10\nfimalgoritmo', 'n=5\nn=10', 'let n=5;\nn=10;'),
  q('e_m1_11', 15, 'Cópia Simples', 'a=1, copia pra b.', '', 'algoritmo "c"\nvar\n a,b: inteiro\ninicio\n a<-1\n b<-a\nfimalgoritmo', 'a=1\nb=a', 'let a=1;\nlet b=a;'),
  q('e_m1_12', 16, 'Contador 0', 'Inicie contador em 0.', '', 'algoritmo "c"\nvar\n c: inteiro\ninicio\n c<-0\nfimalgoritmo', 'c=0', 'let c=0;'),
  q('e_m1_13', 17, 'Concatenação Mágica', 's = "A" + "B".', '', 'algoritmo "c"\nvar\n s: caractere\ninicio\n s<-"A"+"B"\nfimalgoritmo', 's="A"+"B"', 'let s="A"+"B";'),
  q('e_m1_14', 18, 'Ano Atual', 'ano = 2024.', '', 'algoritmo "a"\nvar\n ano: inteiro\ninicio\n ano<-2024\nfimalgoritmo', 'ano=2024', 'let ano=2024;'),
  q('e_m1_15', 19, 'Símbolo Arroba', 'char = "@"', '', 'algoritmo "a"\nvar\n c: caractere\ninicio\n c<-"@"\nfimalgoritmo', 'c="@"', 'let c="@";'),
  q('e_m1_16', 20, 'Atribuição Nula', 'Deixe string vazia', '', 'algoritmo "v"\nvar\n s: caractere\ninicio\n s<-""\nfimalgoritmo', 's=""', 'let s="";'),
  q('e_m1_17', 21, 'Zerar Três (A,B,C)', 'a=0,b=0,c=0.', '', 'algoritmo "z"\nvar\n a,b,c: inteiro\ninicio\n a<-0\n b<-0\n c<-0\nfimalgoritmo', 'a=0\nb=0\nc=0', 'let a=0;\nlet b=0;\nlet c=0;'),
  q('e_m1_18', 22, 'Soma Constante', 'x = 5 + 5.', '', 'algoritmo "s"\nvar\n x: inteiro\ninicio\n x<-5+5\nfimalgoritmo', 'x=5+5', 'let x=5+5;'),
  q('e_m1_19', 23, 'Booleans Inversos', 'a=Verdadeiro, b=Falso', '', 'algoritmo "b"\nvar\n a,b: logico\ninicio\n a<-verdadeiro\n b<-falso\nfimalgoritmo', 'a=True\nb=False', 'let a=true, b=false;'),
  q('e_m1_20', 24, 'Float Zero', 'z = 0.0', '', 'algoritmo "z"\nvar\n z: real\ninicio\n z<-0.0\nfimalgoritmo', 'z=0.0', 'let z=0.0;')
];

// ── M2: Entrada e Saída ──
export const extras_m2 = [
  q('e_m2_1', 5, 'Ecoar', 'Leia texto e exiba texto.', 'Entrada direta para saída.',
    'algoritmo "E"\nvar\n  t: caractere\ninicio\n  leia(t)\n  escreval(t)\nfimalgoritmo',
    't = input()\nprint(t)', 'let t = prompt();\nconsole.log(t);'),
  q('e_m2_2', 6, 'Nome e Idade', 'Leia nome e idade, exiba os dois.', 'Atenção aos tipos se VG.',
    'algoritmo "N"\nvar\n  n: caractere\n  i: inteiro\ninicio\n  leia(n)\n  leia(i)\n  escreval(n, i)\nfimalgoritmo',
    'n = input()\ni = int(input())\nprint(n, i)', 'let n = prompt();\nlet i = parseInt(prompt());\nconsole.log(n, i);'),
  q('e_m2_3', 7, 'Soma IO', 'Leia X e Y, imprima X+Y.', 'Soma direta no print.',
    'algoritmo "S"\nvar\n  x, y: inteiro\ninicio\n  leia(x)\n  leia(y)\n  escreval(x+y)\nfimalgoritmo',
    'x = int(input())\ny = int(input())\nprint(x+y)', 'let x = Number(prompt());\nlet y = Number(prompt());\nconsole.log(x+y);'),
  q('e_m2_4', 8, 'Perguntas Múltiplas', 'Leia A, B, C.', '3 inputs seguidos.',
    'algoritmo "M"\nvar\n  a,b,c: inteiro\ninicio\n  leia(a)\n  leia(b)\n  leia(c)\nfimalgoritmo',
    'a = input()\nb = input()\nc = input()', 'let a=prompt();\nlet b=prompt();\nlet c=prompt();'),
  q('e_m2_5', 9, 'Ler Senha', 'Leia senha como texto.', 'Atribuir a uma var PWD.',
    'algoritmo "P"\nvar\n  p: caractere\ninicio\n  leia(p)\nfimalgoritmo',
    'p = input()', 'let p = prompt();')
  , q('e_m2_6', 10, 'Ler Preço', 'Dado p, leia.', '', 'algoritmo "p"\nvar\n p:real\ninicio\n leia(p)\nfimalgoritmo', 'p=float(input())', 'let p=Number(prompt());'),
  q('e_m2_7', 11, 'Ler Qtde', 'Leia q como inteiro.', '', 'algoritmo "q"\nvar\n q:inteiro\ninicio\n leia(q)\nfimalgoritmo', 'q=int(input())', 'let q=parseInt(prompt());'),
  q('e_m2_8', 12, 'Ler Temperatura', 'Leia t real.', '', 'algoritmo "t"\nvar\n t:real\ninicio\n leia(t)\nfimalgoritmo', 't=float(input())', 'let t=parseFloat(prompt());'),
  q('e_m2_9', 13, 'Ler Cor', 'Leia cor string.', '', 'algoritmo "c"\nvar\n c:caractere\ninicio\n leia(c)\nfimalgoritmo', 'c=input()', 'let c=prompt();'),
  q('e_m2_10', 14, 'Ler Time', 'Time caractere.', '', 'algoritmo "t"\nvar\n time:caractere\ninicio\n leia(time)\nfimalgoritmo', 'time=input()', 'let time=prompt();'),
  q('e_m2_11', 15, 'Ler Estado', 'UF caractere.', '', 'algoritmo "u"\nvar\n uf:caractere\ninicio\n leia(uf)\nfimalgoritmo', 'uf=input()', 'let uf=prompt();'),
  q('e_m2_12', 16, 'Ler CEP', 'CEP string.', '', 'algoritmo "c"\nvar\n cep:caractere\ninicio\n leia(cep)\nfimalgoritmo', 'cep=input()', 'let cep=prompt();'),
  q('e_m2_13', 17, 'Ler Profissão', 'Prof string.', '', 'algoritmo "p"\nvar\n p:caractere\ninicio\n leia(p)\nfimalgoritmo', 'p=input()', 'let p=prompt();'),
  q('e_m2_14', 18, 'Exibir Oi', 'Print Oi.', '', 'algoritmo "o"\ninicio\n escreval("Oi")\nfimalgoritmo', 'print("Oi")', 'console.log("Oi");'),
  q('e_m2_15', 19, 'Ler Altura', 'alt em float.', '', 'algoritmo "a"\nvar\n a:real\ninicio\n leia(a)\nfimalgoritmo', 'a=float(input())', 'let a=parseFloat(prompt());'),
  q('e_m2_16', 20, 'Ler Peso', 'peso float.', '', 'algoritmo "p"\nvar\n p:real\ninicio\n leia(p)\nfimalgoritmo', 'p=float(input())', 'let p=parseFloat(prompt());'),
  q('e_m2_17', 21, 'Sim ou Nao', 's string.', '', 'algoritmo "s"\nvar\n s:caractere\ninicio\n leia(s)\nfimalgoritmo', 's=input()', 'let s=prompt();'),
  q('e_m2_18', 22, 'Vazio', 'String vazia lida.', '', 'algoritmo "v"\nvar\n v:caractere\ninicio\n leia(v)\nfimalgoritmo', 'v=input()', 'let v=prompt();'),
  q('e_m2_19', 23, 'Aviso Alerta', 'Print Alerta', '', 'algoritmo "a"\ninicio\n escreval("Alerta")\nfimalgoritmo', 'print("Alerta")', 'console.log("Alerta");'),
  q('e_m2_20', 24, 'Confirmar Ok', 'Print Ok.', '', 'algoritmo "o"\ninicio\n escreval("Ok")\nfimalgoritmo', 'print("Ok")', 'console.log("Ok");')

];

// ── M3: Matemática ──
export const extras_m3 = [
  q('e_m3_1', 4, 'Área Quadrado', 'L*L.', '', 'algoritmo "a"\nvar\n l: real\ninicio\n leia(l)\n escreval(l*l)\nfimalgoritmo', 'l=float(input())\nprint(l*l)', 'let l=Number(prompt());\nconsole.log(l*l);'),
  q('e_m3_2', 5, 'Perímetro Quadrado', 'L*4.', '', 'algoritmo "p"\nvar\n l: real\ninicio\n leia(l)\n escreval(l*4)\nfimalgoritmo', 'l=float(input())\nprint(l*4)', 'let l=Number(prompt());\nconsole.log(l*4);'),
  q('e_m3_3', 6, 'Dobro', 'n*2.', '', 'algoritmo "d"\nvar\n n: real\ninicio\n leia(n)\n escreval(n*2)\nfimalgoritmo', 'n=float(input())\nprint(n*2)', 'let n=Number(prompt());\nconsole.log(n*2);'),
  q('e_m3_4', 7, 'Metade', 'n/2.', '', 'algoritmo "m"\nvar\n n: real\ninicio\n leia(n)\n escreval(n/2)\nfimalgoritmo', 'n=float(input())\nprint(n/2)', 'let n=Number(prompt());\nconsole.log(n/2);'),
  q('e_m3_5', 8, 'Antecessor', 'n-1.', '', 'algoritmo "a"\nvar\n n: inteiro\ninicio\n leia(n)\n escreval(n-1)\nfimalgoritmo', 'n=int(input())\nprint(n-1)', 'let n=Number(prompt());\nconsole.log(n-1);'),
  q('e_m3_6', 9, 'Sucessor', 'n+1.', '', 'algoritmo "s"\nvar\n n: inteiro\ninicio\n leia(n)\n escreval(n+1)\nfimalgoritmo', 'n=int(input())\nprint(n+1)', 'let n=Number(prompt());\nconsole.log(n+1);'),
  q('e_m3_7', 10, 'Subtração', 'a-b.', '', 'algoritmo "s"\nvar\n a,b: inteiro\ninicio\n leia(a)\n leia(b)\n escreval(a-b)\nfimalgoritmo', 'a=int(input())\nb=int(input())\nprint(a-b)', 'let a=Number(prompt());\nlet b=Number(prompt());\nconsole.log(a-b);')
  , q('e_m3_8', 11, 'Soma1', 'a+1', '', 'algoritmo "s"\nvar\n a:inteiro\ninicio\n escreval(1+1)\nfimalgoritmo', 'print(1+1)', 'console.log(1+1);'),
  q('e_m3_9', 12, 'Soma2', '2+2', '', 'algoritmo "s"\ninicio\n escreval(2+2)\nfimalgoritmo', 'print(2+2)', 'console.log(2+2);'),
  q('e_m3_10', 13, 'Mult3', '3*3', '', 'algoritmo "m"\ninicio\n escreval(3*3)\nfimalgoritmo', 'print(3*3)', 'console.log(3*3);'),
  q('e_m3_11', 14, 'Div4', '4/2', '', 'algoritmo "d"\ninicio\n escreval(4/2)\nfimalgoritmo', 'print(4/2)', 'console.log(4/2);'),
  q('e_m3_12', 15, 'Sub5', '5-1', '', 'algoritmo "s"\ninicio\n escreval(5-1)\nfimalgoritmo', 'print(5-1)', 'console.log(5-1);'),
  q('e_m3_13', 16, 'Soma6', '6+2', '', 'algoritmo "s"\ninicio\n escreval(6+2)\nfimalgoritmo', 'print(6+2)', 'console.log(6+2);'),
  q('e_m3_14', 17, 'Mult7', '7*2', '', 'algoritmo "m"\ninicio\n escreval(7*2)\nfimalgoritmo', 'print(7*2)', 'console.log(7*2);'),
  q('e_m3_15', 18, 'Div8', '8/4', '', 'algoritmo "d"\ninicio\n escreval(8/4)\nfimalgoritmo', 'print(8/4)', 'console.log(8/4);'),
  q('e_m3_16', 19, 'Soma9', '9+1', '', 'algoritmo "s"\ninicio\n escreval(9+1)\nfimalgoritmo', 'print(9+1)', 'console.log(9+1);'),
  q('e_m3_17', 20, 'Mult10', '10*10', '', 'algoritmo "m"\ninicio\n escreval(10*10)\nfimalgoritmo', 'print(10*10)', 'console.log(10*10);'),
  q('e_m3_18', 21, 'Div10', '10/2', '', 'algoritmo "d"\ninicio\n escreval(10/2)\nfimalgoritmo', 'print(10/2)', 'console.log(10/2);'),
  q('e_m3_19', 22, 'Sub10', '10-3', '', 'algoritmo "s"\ninicio\n escreval(10-3)\nfimalgoritmo', 'print(10-3)', 'console.log(10-3);'),
  q('e_m3_20', 23, 'Soma11', '11+1', '', 'algoritmo "s"\ninicio\n escreval(11+1)\nfimalgoritmo', 'print(11+1)', 'console.log(11+1);'),
  q('e_m3_21', 24, 'Mult11', '11*2', '', 'algoritmo "m"\ninicio\n escreval(11*2)\nfimalgoritmo', 'print(11*2)', 'console.log(11*2);'),
  q('e_m3_22', 25, 'Div12', '12/3', '', 'algoritmo "d"\ninicio\n escreval(12/3)\nfimalgoritmo', 'print(12/3)', 'console.log(12/3);')

];

// ── M4: Condicionais ──
export const extras_m4 = [
  q('e_m4_1', 3, 'Maior que 10', 'x > 10', '', 'algoritmo "c"\nvar\n x: inteiro\ninicio\n leia(x)\n se x>10 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x>10:\n print(1)', 'let x=Number(prompt());\nif(x>10) console.log(1);'),
  q('e_m4_2', 4, 'Positivo', 'x > 0', '', 'algoritmo "c"\nvar\n x: inteiro\ninicio\n leia(x)\n se x>0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x>0:\n print(1)', 'let x=Number(prompt());\nif(x>0) console.log(1);'),
  q('e_m4_3', 5, 'Voto Obrigatório', '>= 18', '', 'algoritmo "c"\nvar\n x: inteiro\ninicio\n leia(x)\n se x>=18 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x>=18:\n print(1)', 'let x=Number(prompt());\nif(x>=18) console.log(1);'),
  q('e_m4_4', 6, 'Múltiplo de 5', 'x % 5 == 0', '', 'algoritmo "c"\nvar\n x: inteiro\ninicio\n leia(x)\n se x mod 5 = 0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x%5==0:\n print(1)', 'let x=Number(prompt());\nif(x%5===0) console.log(1);'),
  q('e_m4_5', 7, 'Senha Correta', 's == "123"', '', 'algoritmo "c"\nvar\n s: caractere\ninicio\n leia(s)\n se s="123" entao\n  escreval(1)\n fimse\nfimalgoritmo', 's=input()\nif s=="123":\n print(1)', 'let s=prompt();\nif(s==="123") console.log(1);'),
  q('e_m4_6', 8, 'Apto e Maior', 'x > 10 E y < 20', '', 'algoritmo "c"\nvar\n x,y: inteiro\ninicio\n leia(x)\n leia(y)\n se (x>10) e (y<20) entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\ny=int(input())\nif x>10 and y<20:\n print(1)', 'let x=Number(prompt());\nlet y=Number(prompt());\nif(x>10 && y<20) console.log(1);'),
  q('e_m4_7', 9, 'Divisão Valida', 'b != 0', '', 'algoritmo "c"\nvar\n a,b: inteiro\ninicio\n leia(a)\n leia(b)\n se b<>0 entao\n  escreval(a/b)\n fimse\nfimalgoritmo', 'a=int(input())\nb=int(input())\nif b!=0:\n print(a/b)', 'let a=Number(prompt());\nlet b=Number(prompt());\nif(b!==0) console.log(a/b);')
  , q('e_m4_8', 10, 'Maior Idade', '>18', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x>18 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x>18:\n print(1)', 'let x=parseInt(prompt());\nif(x>18) console.log(1);'),
  q('e_m4_9', 11, 'Diferente Zero', '!=0', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x<>0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x!=0:\n print(1)', 'let x=parseInt(prompt());\nif(x!==0) console.log(1);'),
  q('e_m4_10', 12, 'Igual Cem', '==100', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x=100 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x==100:\n print(1)', 'let x=parseInt(prompt());\nif(x===100) console.log(1);'),
  q('e_m4_11', 13, 'Menor Zero', '<0', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x<0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x<0:\n print(1)', 'let x=parseInt(prompt());\nif(x<0) console.log(1);'),
  q('e_m4_12', 14, 'Maior Igual 50', '>=50', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x>=50 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x>=50:\n print(1)', 'let x=parseInt(prompt());\nif(x>=50) console.log(1);'),
  q('e_m4_13', 15, 'Múltiplo 2', '%2==0', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x mod 2 = 0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x%2==0:\n print(1)', 'let x=parseInt(prompt());\nif(x%2===0) console.log(1);'),
  q('e_m4_14', 16, 'Múltiplo 3', '%3==0', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x mod 3 = 0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x%3==0:\n print(1)', 'let x=parseInt(prompt());\nif(x%3===0) console.log(1);'),
  q('e_m4_15', 17, 'Múltiplo 4', '%4==0', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x mod 4 = 0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x%4==0:\n print(1)', 'let x=parseInt(prompt());\nif(x%4===0) console.log(1);'),
  q('e_m4_16', 18, 'Senha admin', '=="admin"', '', 'algoritmo "c"\nvar\n x:caractere\ninicio\n leia(x)\n se x="admin" entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=input()\nif x=="admin":\n print(1)', 'let x=prompt();\nif(x==="admin") console.log(1);'),
  q('e_m4_17', 19, 'Senha 1234', '=="1234"', '', 'algoritmo "c"\nvar\n x:caractere\ninicio\n leia(x)\n se x="1234" entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=input()\nif x=="1234":\n print(1)', 'let x=prompt();\nif(x==="1234") console.log(1);'),
  q('e_m4_18', 20, 'Letra B', '=="B"', '', 'algoritmo "c"\nvar\n x:caractere\ninicio\n leia(x)\n se x="B" entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=input()\nif x=="B":\n print(1)', 'let x=prompt();\nif(x==="B") console.log(1);'),
  q('e_m4_19', 21, 'Letra C', '=="C"', '', 'algoritmo "c"\nvar\n x:caractere\ninicio\n leia(x)\n se x="C" entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=input()\nif x=="C":\n print(1)', 'let x=prompt();\nif(x==="C") console.log(1);'),
  q('e_m4_20', 22, 'Saldo Positivo', '>0', '', 'algoritmo "c"\nvar\n x:real\ninicio\n leia(x)\n se x>0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=float(input())\nif x>0:\n print(1)', 'let x=parseFloat(prompt());\nif(x>0) console.log(1);'),
  q('e_m4_21', 23, 'Saldo Negativo', '<0', '', 'algoritmo "c"\nvar\n x:real\ninicio\n leia(x)\n se x<0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=float(input())\nif x<0:\n print(1)', 'let x=parseFloat(prompt());\nif(x<0) console.log(1);'),
  q('e_m4_22', 24, 'Fim Jogo', '==0', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n se x=0 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'x=int(input())\nif x==0:\n print(1)', 'let x=parseInt(prompt());\nif(x===0) console.log(1);')
];

// ── M5: Laços ──
export const extras_m5 = [
  q('e_m5_1', 4, 'Tabuada do 2', 'Exiba 2*i.', '', 'algoritmo "c"\nvar\n i: inteiro\ninicio\n para i de 1 ate 5 faca\n  escreval(i*2)\n fimpara\nfimalgoritmo', 'for i in range(1,6):\n print(i*2)', 'for(let i=1;i<=5;i++) console.log(i*2);'),
  q('e_m5_2', 5, 'Conta 3 a 1 (-1)', 'Passo negativo.', '', 'algoritmo "c"\nvar\n i: inteiro\ninicio\n para i de 3 ate 1 passo -1 faca\n  escreval(i)\n fimpara\nfimalgoritmo', 'for i in range(3,0,-1):\n print(i)', 'for(let i=3;i>=1;i--) console.log(i);'),
  q('e_m5_3', 6, 'Pares Simples', 'Passo 2.', '', 'algoritmo "c"\nvar\n i: inteiro\ninicio\n para i de 2 ate 6 passo 2 faca\n  escreval(i)\n fimpara\nfimalgoritmo', 'for i in range(2,7,2):\n print(i)', 'for(let i=2;i<=6;i+=2) console.log(i);'),
  q('e_m5_4', 7, 'Enquanto X > 0', 'Leia x, continue se > 0.', '', 'algoritmo "c"\nvar\n x: inteiro\ninicio\n leia(x)\n enquanto x>0 faca\n  leia(x)\n fimenquanto\nfimalgoritmo', 'x=int(input())\nwhile x>0:\n x=int(input())', 'let x=Number(prompt());\nwhile(x>0) x=Number(prompt());'),
  q('e_m5_5', 8, 'Eco Eco Eco', '3x string eco.', '', 'algoritmo "c"\nvar\n i: inteiro\ninicio\n para i de 1 ate 3 faca\n  escreval("eco")\n fimpara\nfimalgoritmo', 'for i in range(3):\n print("eco")', 'for(let i=0;i<3;i++) console.log("eco");'),
  q('e_m5_6', 9, 'Fatorial 3 Fixo', 'fat de 3.', '', 'algoritmo "c"\nvar\n f,i: inteiro\ninicio\n f<-1\n para i de 1 ate 3 faca\n  f<-f*i\n fimpara\n escreval(f)\nfimalgoritmo', 'f=1\nfor i in range(1,4):\n f*=i\nprint(f)', 'let f=1;\nfor(let i=1;i<=3;i++) f*=i;\nconsole.log(f);')
  , q('e_m5_7', 10, 'Loop 1 a 10', 'for 1..10', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 1 ate 10 faca\n  escreval(i)\n fimpara\nfimalgoritmo', 'for i in range(1,11):\n print(i)', 'for(let i=1;i<=10;i++) console.log(i);'),
  q('e_m5_8', 11, 'Loop 10 a 1', 'for 10..1 step -1', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 10 ate 1 passo -1 faca\n  escreval(i)\n fimpara\nfimalgoritmo', 'for i in range(10,0,-1):\n print(i)', 'for(let i=10;i>=1;i--) console.log(i);'),
  q('e_m5_9', 12, 'Pares 10', 'for 2..10 step 2', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 2 ate 10 passo 2 faca\n  escreval(i)\n fimpara\nfimalgoritmo', 'for i in range(2,11,2):\n print(i)', 'for(let i=2;i<=10;i+=2) console.log(i);'),
  q('e_m5_10', 13, 'Impares 9', 'for 1..9 step 2', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 1 ate 9 passo 2 faca\n  escreval(i)\n fimpara\nfimalgoritmo', 'for i in range(1,10,2):\n print(i)', 'for(let i=1;i<=9;i+=2) console.log(i);'),
  q('e_m5_11', 14, 'Tabuada 3', 'i*3', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 1 ate 10 faca\n  escreval(i*3)\n fimpara\nfimalgoritmo', 'for i in range(1,11):\n print(i*3)', 'for(let i=1;i<=10;i++) console.log(i*3);'),
  q('e_m5_12', 15, 'Tabuada 4', 'i*4', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 1 ate 10 faca\n  escreval(i*4)\n fimpara\nfimalgoritmo', 'for i in range(1,11):\n print(i*4)', 'for(let i=1;i<=10;i++) console.log(i*4);'),
  q('e_m5_13', 16, 'Tabuada 5', 'i*5', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 1 ate 10 faca\n  escreval(i*5)\n fimpara\nfimalgoritmo', 'for i in range(1,11):\n print(i*5)', 'for(let i=1;i<=10;i++) console.log(i*5);'),
  q('e_m5_14', 17, 'Soma 1 a 5', 's+=i', '', 'algoritmo "c"\nvar\n i,s:inteiro\ninicio\n s<-0\n para i de 1 ate 5 faca\n  s<-s+i\n fimpara\n escreval(s)\nfimalgoritmo', 's=0\nfor i in range(1,6):\n s+=i\nprint(s)', 'let s=0;\nfor(let i=1;i<=5;i++) s+=i;\nconsole.log(s);'),
  q('e_m5_15', 18, 'Soma 1 a 10', 's+=i', '', 'algoritmo "c"\nvar\n i,s:inteiro\ninicio\n s<-0\n para i de 1 ate 10 faca\n  s<-s+i\n fimpara\n escreval(s)\nfimalgoritmo', 's=0\nfor i in range(1,11):\n s+=i\nprint(s)', 'let s=0;\nfor(let i=1;i<=10;i++) s+=i;\nconsole.log(s);'),
  q('e_m5_16', 19, 'Fatorial 4', 'f*=i', '', 'algoritmo "c"\nvar\n i,f:inteiro\ninicio\n f<-1\n para i de 1 ate 4 faca\n  f<-f*i\n fimpara\n escreval(f)\nfimalgoritmo', 'f=1\nfor i in range(1,5):\n f*=i\nprint(f)', 'let f=1;\nfor(let i=1;i<=4;i++) f*=i;\nconsole.log(f);'),
  q('e_m5_17', 20, 'Fatorial 5', 'f*=i', '', 'algoritmo "c"\nvar\n i,f:inteiro\ninicio\n f<-1\n para i de 1 ate 5 faca\n  f<-f*i\n fimpara\n escreval(f)\nfimalgoritmo', 'f=1\nfor i in range(1,6):\n f*=i\nprint(f)', 'let f=1;\nfor(let i=1;i<=5;i++) f*=i;\nconsole.log(f);'),
  q('e_m5_18', 21, 'Eco 2x', 'print 2x', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 1 ate 2 faca\n  escreval("eco")\n fimpara\nfimalgoritmo', 'for i in range(2):\n print("eco")', 'for(let i=0;i<2;i++) console.log("eco");'),
  q('e_m5_19', 22, 'Eco 4x', 'print 4x', '', 'algoritmo "c"\nvar\n i:inteiro\ninicio\n para i de 1 ate 4 faca\n  escreval("eco")\n fimpara\nfimalgoritmo', 'for i in range(4):\n print("eco")', 'for(let i=0;i<4;i++) console.log("eco");'),
  q('e_m5_20', 23, 'While < 10', 'x<10', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n enquanto x<10 faca\n  leia(x)\n fimenquanto\nfimalgoritmo', 'x=int(input())\nwhile x<10:\n x=int(input())', 'let x=parseInt(prompt());\nwhile(x<10) x=parseInt(prompt());'),
  q('e_m5_21', 24, 'While != 5', 'x<>5', '', 'algoritmo "c"\nvar\n x:inteiro\ninicio\n leia(x)\n enquanto x<>5 faca\n  leia(x)\n fimenquanto\nfimalgoritmo', 'x=int(input())\nwhile x!=5:\n x=int(input())', 'let x=parseInt(prompt());\nwhile(x!==5) x=parseInt(prompt());')
];

// ── M6: Funções ──
export const extras_m6 = [
  q('e_m6_1', 3, 'Dobro (Função)', 'Crie funcao que retorna A*2.', '', 'algoritmo "f"\nfuncao D(a:inteiro):inteiro\ninicio\n retorne a*2\nfimfuncao\ninicio\nfimalgoritmo', 'def D(a):\n return a*2\n', 'function D(a){\n return a*2;\n}'),
  q('e_m6_2', 4, 'Menor de Dois', 'Retorna menor (A,B).', '', 'algoritmo "f"\nfuncao M(a,b:inteiro):inteiro\ninicio\n se a<b entao\n  retorne a\n senao\n  retorne b\n fimse\nfimfuncao\ninicio\nfimalgoritmo', 'def M(a,b):\n if a<b:\n  return a\n return b', 'function M(a,b){\n if (a<b) return a;\n return b;\n}'),
  q('e_m6_3', 5, 'Procedimento Eco', 'Exibe "eco" V vezes.', '', 'algoritmo "p"\nprocedimento E(v:inteiro)\nvar\n i:inteiro\ninicio\n para i de 1 ate v faca\n  escreval("eco")\n fimpara\nfimprocedimento\ninicio\nfimalgoritmo', 'def E(v):\n for i in range(v):\n  print("eco")', 'function E(v){\n for(let i=0;i<v;i++) console.log("eco");\n}'),
  q('e_m6_4', 6, 'É Par?', 'Retorna Verdadeiro se par.', '', 'algoritmo "f"\nfuncao P(x:inteiro):logico\ninicio\n retorne (x mod 2 = 0)\nfimfuncao\ninicio\nfimalgoritmo', 'def P(x):\n return x%2==0', 'function P(x){\n return x%2===0;\n}')
  , q('e_m7_7', 10, 'Ler 3', 'for i 3 read', '', 'algoritmo "v"\nvar\n v: vetor[1..3] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 3 faca\n  leia(v[i])\n fimpara\nfimalgoritmo', 'v=[0,0,0]\nfor i in range(3):\n v[i]=int(input())', 'let v=[0,0,0];\nfor(let i=0;i<3;i++) v[i]=Number(prompt());'),
  q('e_m7_8', 11, 'Ler 4', 'for i 4 read', '', 'algoritmo "v"\nvar\n v: vetor[1..4] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 4 faca\n  leia(v[i])\n fimpara\nfimalgoritmo', 'v=[0]*4\nfor i in range(4):\n v[i]=int(input())', 'let v=[0,0,0,0];\nfor(let i=0;i<4;i++) v[i]=Number(prompt());'),
  q('e_m7_9', 12, 'Zera 4', 'v[1..4]=0', '', 'algoritmo "v"\nvar\n v: vetor[1..4] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 4 faca\n  v[i]<-0\n fimpara\nfimalgoritmo', 'v=[0]*4\nfor i in range(4):\n v[i]=0', 'let v=[0,0,0,0];\nfor(let i=0;i<4;i++) v[i]=0;'),
  q('e_m7_10', 13, 'Zera 5', 'v[1..5]=0', '', 'algoritmo "v"\nvar\n v: vetor[1..5] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 5 faca\n  v[i]<-0\n fimpara\nfimalgoritmo', 'v=[0]*5\nfor i in range(5):\n v[i]=0', 'let v=[0,0,0,0,0];\nfor(let i=0;i<5;i++) v[i]=0;'),
  q('e_m7_11', 14, 'Pos 1=10', 'v[1]=10', '', 'algoritmo "v"\nvar\n v: vetor[1..3] de inteiro\ninicio\n v[1]<-10\nfimalgoritmo', 'v=[0,0,0]\nv[0]=10', 'let v=[0,0,0];\nv[0]=10;'),
  q('e_m7_12', 15, 'Pos 2=20', 'v[2]=20', '', 'algoritmo "v"\nvar\n v: vetor[1..3] de inteiro\ninicio\n v[2]<-20\nfimalgoritmo', 'v=[0,0,0]\nv[1]=20', 'let v=[0,0,0];\nv[1]=20;'),
  q('e_m7_13', 16, 'Pos 3=30', 'v[3]=30', '', 'algoritmo "v"\nvar\n v: vetor[1..3] de inteiro\ninicio\n v[3]<-30\nfimalgoritmo', 'v=[0,0,0]\nv[2]=30', 'let v=[0,0,0];\nv[2]=30;'),
  q('e_m7_14', 17, 'Pos 4=40', 'v[4]=40', '', 'algoritmo "v"\nvar\n v: vetor[1..4] de inteiro\ninicio\n v[4]<-40\nfimalgoritmo', 'v=[0]*4\nv[3]=40', 'let v=[0,0,0,0];\nv[3]=40;'),
  q('e_m7_15', 18, 'Print V 3', 'print 3 pos', '', 'algoritmo "v"\nvar\n v: vetor[1..3] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 3 faca\n  escreval(v[i])\n fimpara\nfimalgoritmo', 'v=[1,2,3]\nfor i in range(3):\n print(v[i])', 'let v=[1,2,3];\nfor(let i=0;i<3;i++) console.log(v[i]);'),
  q('e_m7_16', 19, 'Print V 4', 'print 4 pos', '', 'algoritmo "v"\nvar\n v: vetor[1..4] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 4 faca\n  escreval(v[i])\n fimpara\nfimalgoritmo', 'v=[1,2,3,4]\nfor i in range(4):\n print(v[i])', 'let v=[1,2,3,4];\nfor(let i=0;i<4;i++) console.log(v[i]);'),
  q('e_m7_17', 20, 'Print V 5', 'print 5 pos', '', 'algoritmo "v"\nvar\n v: vetor[1..5] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 5 faca\n  escreval(v[i])\n fimpara\nfimalgoritmo', 'v=[1,2,3,4,5]\nfor i in range(5):\n print(v[i])', 'let v=[1,2,3,4,5];\nfor(let i=0;i<5;i++) console.log(v[i]);'),
  q('e_m7_18', 21, 'Mult Todos 2', 'v[i]*=2', '', 'algoritmo "v"\nvar\n v: vetor[1..2] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 2 faca\n  v[i]<-v[i]*2\n fimpara\nfimalgoritmo', 'v=[1,2]\nfor i in range(2):\n v[i]*=2', 'let v=[1,2];\nfor(let i=0;i<2;i++) v[i]*=2;'),
  q('e_m7_19', 22, 'Mult Todos 3', 'v[i]*=3', '', 'algoritmo "v"\nvar\n v: vetor[1..2] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 2 faca\n  v[i]<-v[i]*3\n fimpara\nfimalgoritmo', 'v=[1,2]\nfor i in range(2):\n v[i]*=3', 'let v=[1,2];\nfor(let i=0;i<2;i++) v[i]*=3;'),
  q('e_m7_20', 23, 'Soma Limit 3', 'soma 3', '', 'algoritmo "s"\nvar\n v: vetor[1..3] de inteiro\n s,i:inteiro\ninicio\n s<-0\n para i de 1 ate 3 faca\n  s<-s+v[i]\n fimpara\nfimalgoritmo', 'v=[1,2,3]\ns=0\nfor i in range(3):\n s+=v[i]', 'let v=[1,2,3];\nlet s=0;\nfor(let i=0;i<3;i++) s+=v[i];'),
  q('e_m7_21', 24, 'Soma Limit 4', 'soma 4', '', 'algoritmo "s"\nvar\n v: vetor[1..4] de inteiro\n s,i:inteiro\ninicio\n s<-0\n para i de 1 ate 4 faca\n  s<-s+v[i]\n fimpara\nfimalgoritmo', 'v=[1,2,3,4]\ns=0\nfor i in range(4):\n s+=v[i]', 'let v=[1,2,3,4];\nlet s=0;\nfor(let i=0;i<4;i++) s+=v[i];')

];

// ── M7: Vetores ──
export const extras_m7 = [
  q('e_m7_1', 4, 'Cria e Zera', 'Vetor de 3, todos viram 0.', '', 'algoritmo "v"\nvar\n v: vetor[1..3] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 3 faca\n  v[i]<-0\n fimpara\nfimalgoritmo', 'v=[0,0,0]\nfor i in range(3):\n v[i]=0', 'let v=[0,0,0];\nfor(let i=0;i<3;i++) v[i]=0;'),
  q('e_m7_2', 5, 'Ultimo <- 99', 'Pos3 <- 99.', '', 'algoritmo "v"\nvar\n v: vetor[1..3] de inteiro\ninicio\n v[3]<-99\nfimalgoritmo', 'v=[0,0,0]\nv[2]=99', 'let v=[0,0,0];\nv[2]=99;'),
  q('e_m7_3', 6, 'Ler para Vetor', 'Lê 2 valores pro vetor.', '', 'algoritmo "v"\nvar\n v: vetor[1..2] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 2 faca\n  leia(v[i])\n fimpara\nfimalgoritmo', 'v=[0,0]\nfor i in range(2):\n v[i]=int(input())', 'let v=[0,0];\nfor(let i=0;i<2;i++) v[i]=Number(prompt());'),
  q('e_m7_4', 7, 'Mostrar Inverso', 'Mostra pos2 depois pos1.', '', 'algoritmo "v"\nvar\n v: vetor[1..2] de inteiro\ninicio\n v[1]<-1\n v[2]<-2\n escreval(v[2])\n escreval(v[1])\nfimalgoritmo', 'v=[1,2]\nprint(v[1])\nprint(v[0])', 'let v=[1,2];\nconsole.log(v[1]);\nconsole.log(v[0]);'),
  q('e_m7_5', 8, 'Busca Fixo', 'Se v[2]==10 Print', '', 'algoritmo "v"\nvar\n v: vetor[1..3] de inteiro\ninicio\n v[2]<-10\n se v[2]=10 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'v=[0,10,0]\nif v[1]==10:\n print(1)', 'let v=[0,10,0];\nif(v[1]===10) console.log(1);'),
  q('e_m7_6', 9, 'Tudo +1', 'Itera e soma 1 a tds.', '', 'algoritmo "v"\nvar\n v: vetor[1..2] de inteiro\n i:inteiro\ninicio\n para i de 1 ate 2 faca\n  v[i]<-v[i]+1\n fimpara\nfimalgoritmo', 'v=[1,2]\nfor i in range(2):\n v[i]+=1', 'let v=[1,2];\nfor(let i=0;i<2;i++) v[i]+=1;')
];

// ── M8: Algoritmos ──
export const extras_m8 = [
  q('e_m8_1', 3, 'Gorjeta 10%', 'Custo lido, imprimir 10%.', '', 'algoritmo "a"\nvar\n c: real\ninicio\n leia(c)\n escreval(c*0.1)\nfimalgoritmo', 'c=float(input())\nprint(c*0.1)', 'let c=Number(prompt());\nconsole.log(c*0.1);'),
  q('e_m8_2', 4, 'Desconto Mágico', 'Se valor>100 desce 10, senão 5.', '', 'algoritmo "a"\nvar\n v: real\ninicio\n leia(v)\n se v>100 entao\n  v<-v-10\n senao\n  v<-v-5\n fimse\nfimalgoritmo', 'v=float(input())\nif v>100:\n v-=10\nelse:\n v-=5', 'let v=Number(prompt());\nif(v>100) v-=10;\nelse v-=5;'),
  q('e_m8_3', 5, 'Quadrado Menor Que 50', 'Se area quadrada < 50 avise.', '', 'algoritmo "a"\nvar\n l,a: real\ninicio\n leia(l)\n a<-l*l\n se a<50 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'l=float(input())\na=l*l\nif a<50:\n print(1)', 'let l=Number(prompt());\nlet a=l*l;\nif(a<50) console.log(1);'),
  q('e_m8_4', 6, 'Loop Até 123', 'Ler X ate ser 123', '', 'algoritmo "a"\nvar\n x: inteiro\ninicio\n leia(x)\n enquanto x<>123 faca\n  leia(x)\n fimenquanto\nfimalgoritmo', 'x=int(input())\nwhile x!=123:\n x=int(input())', 'let x=0;\nwhile(x!==123) x=Number(prompt());'),
  q('e_m8_5', 7, 'Gorjeta 15%', '*0.15', '', 'algoritmo "a"\nvar\n c:real\ninicio\n leia(c)\n escreval(c*0.15)\nfimalgoritmo', 'c=float(input())\nprint(c*0.15)', 'let c=Number(prompt());\nconsole.log(c*0.15);'),
  q('e_m8_6', 8, 'Gorjeta 20%', '*0.20', '', 'algoritmo "a"\nvar\n c:real\ninicio\n leia(c)\n escreval(c*0.20)\nfimalgoritmo', 'c=float(input())\nprint(c*0.20)', 'let c=Number(prompt());\nconsole.log(c*0.20);'),
  q('e_m8_7', 9, 'Desc 20', 'if>200 -=20', '', 'algoritmo "a"\nvar\n v:real\ninicio\n leia(v)\n se v>200 entao\n  v<-v-20\n fimse\nfimalgoritmo', 'v=float(input())\nif v>200:\n v-=20', 'let v=Number(prompt());\nif(v>200) v-=20;'),
  q('e_m8_8', 10, 'Desc 30', 'if>300 -=30', '', 'algoritmo "a"\nvar\n v:real\ninicio\n leia(v)\n se v>300 entao\n  v<-v-30\n fimse\nfimalgoritmo', 'v=float(input())\nif v>300:\n v-=30', 'let v=Number(prompt());\nif(v>300) v-=30;'),
  q('e_m8_9', 11, 'Quad < 10', 'a<10', '', 'algoritmo "a"\nvar\n l,a:real\ninicio\n leia(l)\n a<-l*l\n se a<10 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'l=float(input())\na=l*l\nif a<10:\n print(1)', 'let l=Number(prompt());\nlet a=l*l;\nif(a<10) console.log(1);'),
  q('e_m8_10', 12, 'Quad < 20', 'a<20', '', 'algoritmo "a"\nvar\n l,a:real\ninicio\n leia(l)\n a<-l*l\n se a<20 entao\n  escreval(1)\n fimse\nfimalgoritmo', 'l=float(input())\na=l*l\nif a<20:\n print(1)', 'let l=Number(prompt());\nlet a=l*l;\nif(a<20) console.log(1);'),
  q('e_m8_11', 13, 'Loop 111', '!=111', '', 'algoritmo "a"\nvar\n x:inteiro\ninicio\n leia(x)\n enquanto x<>111 faca\n  leia(x)\n fimenquanto\nfimalgoritmo', 'x=int(input())\nwhile x!=111:\n x=int(input())', 'let x=0;\nwhile(x!==111) x=Number(prompt());'),
  q('e_m8_12', 14, 'Loop 222', '!=222', '', 'algoritmo "a"\nvar\n x:inteiro\ninicio\n leia(x)\n enquanto x<>222 faca\n  leia(x)\n fimenquanto\nfimalgoritmo', 'x=int(input())\nwhile x!=222:\n x=int(input())', 'let x=0;\nwhile(x!==222) x=Number(prompt());'),
  q('e_m8_13', 15, 'Taxa Fixa R$5', 'v+=5', '', 'algoritmo "a"\nvar\n v:real\ninicio\n leia(v)\n v<-v+5\nfimalgoritmo', 'v=float(input())\nv+=5', 'let v=Number(prompt());\nv+=5;'),
  q('e_m8_14', 16, 'Taxa Fixa R$10', 'v+=10', '', 'algoritmo "a"\nvar\n v:real\ninicio\n leia(v)\n v<-v+10\nfimalgoritmo', 'v=float(input())\nv+=10', 'let v=Number(prompt());\nv+=10;'),
  q('e_m8_15', 17, 'Bonus Compra', 'if>50 b=5', '', 'algoritmo "a"\nvar\n c:real\ninicio\n leia(c)\n se c>50 entao\n  c<-c+5\n fimse\nfimalgoritmo', 'c=float(input())\nif c>50:\n c+=5', 'let c=Number(prompt());\nif(c>50) c+=5;'),
  q('e_m8_16', 18, 'Bonus Super', 'if>100 b=10', '', 'algoritmo "a"\nvar\n c:real\ninicio\n leia(c)\n se c>100 entao\n  c<-c+10\n fimse\nfimalgoritmo', 'c=float(input())\nif c>100:\n c+=10', 'let c=Number(prompt());\nif(c>100) c+=10;'),
  q('e_m8_17', 19, 'Lucro Limpo 10%', 'v*0.9', '', 'algoritmo "a"\nvar\n v:real\ninicio\n leia(v)\n escreval(v*0.9)\nfimalgoritmo', 'v=float(input())\nprint(v*0.9)', 'let v=Number(prompt());\nconsole.log(v*0.9);'),
  q('e_m8_18', 20, 'Lucro Limpo 20%', 'v*0.8', '', 'algoritmo "a"\nvar\n v:real\ninicio\n leia(v)\n escreval(v*0.8)\nfimalgoritmo', 'v=float(input())\nprint(v*0.8)', 'let v=Number(prompt());\nconsole.log(v*0.8);'),
  q('e_m8_19', 21, 'Multa Atraso', '+2', '', 'algoritmo "a"\nvar\n c:real\ninicio\n leia(c)\n c<-c+2\nfimalgoritmo', 'c=float(input())\nc+=2', 'let c=Number(prompt());\nc+=2;')
];
