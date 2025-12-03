- Celular e computador na **mesma rede Wi-Fi**

Instalar Dependências

**IMPORTANTE:** Use `--legacy-peer-deps` obrigatoriamente:
npm install --legacy-peer-deps
cd server
npm install
cd ..
```

Configurar a Variável de Ambiente

Abra o arquivo `.env` na raiz do projeto e **APENAS MODIFIQUE** a última linha:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:4000
```

Exemplo:
```env
EXPO_PUBLIC_API_URL=http://192.168.0.105:4000
```


SE NECESSÁRIO(CASO NÃO RODE KKKKKK)

```powershell
netsh advfirewall firewall add rule name="Node.js Server Port 4000" dir=in action=allow protocol=TCP localport=4000
```

**Usuário Administrador:**
- Email: `admin@test.com`
- Senha: `admi!062025`

## versão web

## ao abrir o projeto digitar cd server no terminal
## após isso npm start ele vai iniciar o servidor

## sofremos um pouco na questão da definição de rotas então acaba tendo que usar bastante o retroceder

