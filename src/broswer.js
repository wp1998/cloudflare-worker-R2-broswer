
// 显示列表视图
export function showList(files, folders, path, env) {
    const html = `<!doctype html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>R2 Broswer</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        <script language="javascript">

            // 下载文件
            function downloadObject(path) {
                const currentURL = window.location.href;
                const getURL =  currentURL + path;
                const link = document.createElement('a');
                link.href = getURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        
            // 删除文件
            async function deleteObject(path) {
                const currentURL = window.location.href;
                const deleteURL = currentURL + path;
                console.log(deleteURL);
                showAndHideStatus("show", '删除文件...');

                await fetch(deleteURL, {
                    method: 'DELETE',
                }).then(response => {
                    if (!response.ok) {
                        addContentStatus('删除文件失败');
                    } else {
                        showAndHideStatus("hide","")
                        location.reload();
                    }
                }).catch(error => {
                    addContentStatus('删除文件失败');
                });
            }

            // 上传文件
            async function uploadFile() {
                const currentURL = window.location.href;
                const fileInput = document.getElementById('formFileSm');
                const file = fileInput.files[0];

                showAndHideStatus("show", '开始上传...');

                if (file) {
                    const url = currentURL + file.name;
                    const headers = {
                        "Content-Type": file.type,
                    };
                    await fetch(url, {
                        method: 'PUT',
                        body: file,
                        headers: headers
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error('上传文件失败');
                        }
                        console.log('文件上传成功');
                        showAndHideStatus("hide","")
                        location.reload();
                    }).catch(error => {
                        console.error('上传文件时出现错误:', error);
                        showAndHideStatus("hide","")
                    });
                } else {
                    showAndHideStatus("show", '请选择上传的文件');
                }
            }

            // 上传文件夹
            async function uploadFolder() {
                const currentURL = window.location.href;
                const folderInput = document.getElementById('formFolderSm');
                const files = folderInput.files;

                if (files.length > 0) {

                    showAndHideStatus("show", '开始上传文件夹中的文件...');

                    for (let i = 0; i < files.length; i++) {

                        const file = files[i];

                        if (file.name.charAt(0) !== '.') {
                            // console.log(file);
                            const url = currentURL + file.webkitRelativePath;
                            console.log('上传文件：', url);

                            const headers = {
                                "Content-Type": file.type
                            };

                            await fetch(url, {
                                method: 'PUT',
                                body: file,
                                headers: headers
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('上传文件失败');
                                }
                                console.log('文件上传成功');
                                addContentStatus(file.webkitRelativePath + "上传成功...");
                            })
                            .catch(error => {
                                console.error('上传文件时出现错误:' + file.webkitRelativePath, error);
                            });

                        } else {
                            console.log("item is .file");
                        };

                    };

                    showAndHideStatus("hide","")
                    location.reload();
                    
                } else {
                    showAndHideStatus("show", '请选择上传的文件夹');
                }

            }

            function showAndHideStatus(showOrHide, status){
                // 提示信息
                const toastLive = document.getElementById('liveToast')
                const toast = new bootstrap.Toast(toastLive)
                const r2Status = document.getElementById('r2StatusContent');
                switch (showOrHide) {
                    case "show":
                        addContentStatus(status);
                        toast.show();
                        break;
                    case "hide":
                        toast.hide();
                        break;
                    default:
                        break;
                }
            }
            
            function addContentStatus(status) {
                const r2Status = document.getElementById('r2StatusContent');
                const li = document.createElement('li');
                li.textContent = status;
                r2Status.appendChild(li);
            }

            function showFileDialog() {
                const fileInput = document.getElementById('formFileSm');
                fileInput.click();
            }

            function showFolderDialog() {
                const folderInput = document.getElementById('formFolderSm');
                folderInput.click();
            }
        </script>
    </head>
    <body>
    <header class="container">
        <div class="grid text-center p-3 align-bottom">
            <p class="fs-3">${env.TITLE}</p>
            <figcaption class="blockquote-footer">
            <em>${env.DESC}</em>
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
            <table class="table table-sm table-striped caption-top">
                <thead>
                <tr>
                    <th scope="col" width="20"></th>
                    <th scope="col col-md-auto">名称</th>
                    <th scope="col col-3">类型</th>
                    <th scope="col col-2">大小</th>
                    <th scope="col col-2">修改时间</th>
                    <th scope="col col-1">管理</th>
                </tr>
                </thead>
                <tbody class="table-group-divider">
                    ${ (path === '/') ? '' : showGoup(path)}
                    ${ folders ? showFolders(folders) : ''}
                    ${ files ? showFiles(files) : ''}
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col col-5">
                <div class="button-group">
                    <button type="button" class="btn btn-sm btn-dark" onclick="showFileDialog()">
                    上传文件
                    <input id="formFileSm" type="file" hidden onchange="uploadFile()">
                    </button>
                    -  
                    <button type="button" class="btn btn-sm btn-dark" onclick="showFolderDialog()">
                    <input id="formFolderSm" type="file" hidden webkitdirectory onchange="uploadFolder()">
                    上传文件夹
                    </buttion>
                </div>
            </div>
            <div class="col col-7 text-end">
            </div>
        </div>
    </main>
    <foote class="container">
        <div class="grid text-center p-3">
            <em><a href="https://github.com/wp1998/r2-broswer-worker"> GitHub </a></em>
        </div>
    </footer>
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="false" data-bs-autohide="false">
            <div class="toast-header">
                <strong class="me-auto">提示</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body" id="r2StatusContent"></div>
            </div>
        </div>
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
            <td>
                <div class="btn-group btn-group-justify" role="group" aria-label="Button Group">
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="downloadObject('${getFileName(files[i].key)}')">下载</button>
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="deleteObject('${encodeURIComponent(getFileName(files[i].key))}')">删除</button>
                </div>
            </td>
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