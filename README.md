# Static - 0

用github存图片什么的最开心了

将图片放在 source 目录中，可以添加目录作为命名空间

运行 ```npm run build```

图片会进行重命名并分散存储

图片的命名规则为

```
uuidv5(sha1(文件内容), uuidv5(package.json:domain, uuidv5.DNS))
```

访问对应的网址查看图片，复制地址什么的

后续工作

- 发布npm
- 版本号自动升级
- 把npm的镜像当cdn使
- happy