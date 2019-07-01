const fs = require('fs');
const path = require('path');

const asyncFs = {
    readdir: asyncify(fs.readdir),
    stat: asyncify(fs.stat)
};

update()
    .then(
        data => data,
        e => console.error(e)
    );

// 构建目录树
async function buildDirTree(dir) {
    const stat = await asyncFs.stat(dir);
    // 如果是文件，直接返回
    if (stat.isFile()) {
        return {
            name: path.basename(dir, '.md'),
            dir: dir,
            children: null
        };
    }
    // 如果是目录，遍历其中文件
    const list = await asyncFs.readdir(dir);
    const children = [ ];
    for (let index in list) {
        const node = await buildDirTree(path.join(dir, list[index]));
        children.push(node);
    }
    return {
        dir: dir,
        children: children
    };
}

// 遍历目录树，收集子节点
function traversalDirTree(root, list) {
    const children = root.children;
    if (!children) {
        list.push(root);
        return;
    }
    for (let index in children) {
        traversalDirTree(children[index], list);
    }
}

// 收集markdown文件
function collectMarkdownFiles(list) {
    return list
        .filter(file => {
            return path.extname(file.dir) === '.md' && file.name !== 'README';
        })
        .map(file => {
            return {
                name: file.name,
                dir: `./${file.dir}`
            }
        });
}

// 更新README.md中的目录
async function update() {
    const leaves = [ ];
    const tree = await buildDirTree('./');
    traversalDirTree(tree, leaves);
    const articles = collectMarkdownFiles(leaves);
    fs.writeFileSync('./README.md', `${getTitle()}${getContent(articles)}`, );
}

function getTitle() {
    return `## 博客\n目录\n\n`;
}

function getContent(articles) {
    return articles
        .map(article => getContentItem(article))
        .join(`\n\n`)
        .toString()

    function getContentItem(article) {
        return `- [${article.name}](${article.dir})`;
    }
}

function asyncify(fn) {
    return function() {
        const args = arguments;
        return new Promise((resolve, reject) => {
            fn(...args, (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        });
    }
}

function test() {
    const leaves = [ ];
    buildDirTree('./')
    .then(tree => {
        traversalDirTree(tree, leaves);
        console.log(collectMarkdownFiles(leaves));
    });
}
