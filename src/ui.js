// 显示列表视图
export function showList(files, folders, path) {
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>R2 Broswer</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    </head>
    <body>
    <header class="container">
        <div class="grid text-center p-3 align-bottom">
            <p class="fs-3">R2 Broswer</p>
            <figcaption class="blockquote-footer">
            <em>a file drive power by cloudflare worker & R2 storage</em>
            </figcaption>
        </div>
    </header>
    <main class="container">
        <div class="grid">
            <div>
                当前路径：${decodeURIComponent(path)}
            </div>
        </div>
        <div class="grid">
            <table class="table table-striped caption-top">
                <thead>
                <tr>
                    <th scope="col" width="20"></th>
                    <th scope="col col-md-auto">名称</th>
                    <th scope="col col-3">类型</th>
                    <th scope="col col-2">大小</th>
                    <th scope="col col-2">修改时间</th>
                </tr>
                </thead>
                <tbody class="table-group-divider">
                    ${(path==='/')?'':showGoup(path)}
                    ${showFolders(folders)}
                    ${showFiles(files)}
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col col-3">
                <div class="input-group">
                    <input class="form-control form-control-sm" id="formFileSm" type="file">
                    <button type="button" class="btn btn-sm btn-dark">上传</button>
                </div>
            </div>
            <div class="col col-9 text-end">
                <em><a href="https://github.com/wp1998/r2-broswer-worker"> GitHub </a></em>
            </div>
        </div>
    </main>

    </body>
    </html>`;
  
    return html;
};

// 显示文件夹列表
function showFolders(folders) {
    var output = '';
    for (var i = 0; i < folders.length; i++) {
        output += `<tr>
            <th scope="row">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" class="bi bi-folder" viewBox="0 0 16 16">
                    <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
                </svg>
            </th>
            <td>
                <a href="/${folders[i]}">${getFolderName(folders[i])}</a>
            </td>
            <td>目录</td>
            <td></td>
            <td></td>
        </tr>`;
    }
    return output;
};

// 显示文件列表
function showFiles(files) {
    var output = '';
    for (var i = 0; i < files.length; i++) {
        output += `<tr>
            <th scope="row">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" class="bi bi-file-earmark" viewBox="0 0 16 16">
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                </svg>
            </th>
            <td>
                ${getFileName(files[i].key)}
            </td>
            <td>${files[i].httpMetadata.contentType}</td>
            <td>${getFileSizeDescription(files[i].size)}</td>
            <td>${getFileDateStr(files[i].uploaded)}</td>
        </tr>`;
    }
    return output;
};

// 显示返回上级
function showGoup(path) {
    if(path !== "") {
        return `
        <tr>
            <th scope="row">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                </svg>
            </th>
            <td>
                <a href="..">返回上级</a>
            </td>
            <td></td>
            <td></td>
            <td></td>
        </tr>`;
    }
    return '';
};

// 文件夹名过滤
function getFolderName(name) {
    return name.slice(0, -1).split("/").slice(-1).pop();
};

// 文件名过滤
function getFileName(name) {
    return name.split("/").slice(-1).pop();
};

// 文件创建时间格式化
function getFileDateStr(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

// 文件大小格式化
function getFileSizeDescription(fileSize) {
    const units = ["Byte", "KB", "MB", "GB"];
    let size = fileSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return size.toFixed(2) + units[unitIndex];
};
  