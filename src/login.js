export function showLogin() {
    const html = `<!doctype html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Login</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        
        <script language="javascript">

            async function login() {
                const currentURL = window.location.href;
                const username = document.getElementById('floatingUsername').value;
                const password = document.getElementById('floatingPassword').value;
                const credentials = username+":"+password;
                
                const encodedCredentials = btoa(credentials);
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Authorization': "Basic "+encodedCredentials
                    },
                };
                console.log(requestOptions);
                await fetch(currentURL, requestOptions)
                .then(response => {
                    if (response.ok) {
                        // 登录成功，可以进行进一步的操作
                        console.log('Login successful');
                        // location.reload();
                    } else {
                        // 登录失败，处理错误
                        console.error('Login failed');
                    }
                })
                .catch(error => {
                    // 处理异常
                    console.error('An error occurred:', error);
                });
            };
        </script>
    </head>
    <body class="text-center bg-light">
        <main class="form-signin w-25 mt-5 mx-auto">
        <h1 class="h3 mb-3 fw-normal">Authorization</h1>

        <div class="form-floating">
            <input type="username" class="form-control" id="floatingUsername" placeholder="username">
            <label for="floatingUsername">username</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="password">
            <label for="floatingPassword">Password</label>
        </div>
        <div class="checkbox mb-3"></div>
        <button class="w-100 btn btn-lg btn-primary" type="submit" onclick="login()">Sign in</button>
        <p class="mt-5 mb-3 text-muted">&copy; 2022–2023</p>
    </main>
  </body>
</html>
`
    return html;
};

// http basic auth
export function validateAuthorization(authorization, env) {

    const [scheme, encoded] = authorization.split(" ");
    // The Authorization header must start with Basic, followed by a space.
    // console.log([scheme, encoded]);
    if (!encoded || scheme !== "Basic") {
        return false;
    } else {
        const credentials = atob(encoded);
        // The username & password are split by the first colon.
        //=> example: "username:password"
        const index = credentials.indexOf(":");
        const user = credentials.substring(0, index);
        const pass = credentials.substring(index + 1);

        if (user === env.USER && pass === env.PASS) {
            return true;
        } else {
            return false;
        }
    }
};

