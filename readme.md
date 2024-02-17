# 个人博客系统部署

### Docker部署

[docker-ce镜像_docker-ce下载地址_docker-ce安装教程-阿里巴巴开源镜像站 (aliyun.com)](https://developer.aliyun.com/mirror/docker-ce?spm=a2c6h.13651102.0.0.57e31b119dVUBD)

```shell
# step 1: 安装必要的一些系统工具
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
# Step 2: 添加软件源信息
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# Step 3
sudo sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
# Step 4: 更新并安装Docker-CE
sudo yum makecache fast
sudo yum -y install docker-ce
# Step 4: 开启Docker服务
systemctl enable --now docker
```

## 运行数据库容器

```shell
[root@localhost blogJob]# docker run --restart always --name blog_redis -it -d -v /root/blogJob/redisData/:/data redis

[root@localhost blogJob]# docker run --restart always  --name blog_mongo -v /root/blogJob/mongoData/:/data/db -d mongo
```



## 运行业务容器

### 后端Gin部署

```shell
[root@localhost BackEnd]# cat backFile 
FROM centos:7

COPY go1.22.0.linux-amd64.tar.gz /root/
COPY blog.zip /root/

RUN cd /root/ && \
    rm -rf /usr/local/go && tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz && \
    export PATH=$PATH:/usr/local/go/bin && \
    yum install unzip -y && \
    unzip blog.zip && \
    export GO111MODULE=on && \
    export GOPROXY=https://goproxy.cn && \
    cd blog/ && \
    go mod init blog && go mod tidy && \
    go build

WORKDIR /root/blog/

CMD ["/usr/local/go/bin/go", "run", "blog"]
[root@localhost BackEnd]# docker build -t bachend:v1 -f backFile .
[root@localhost BackEnd]# docker run -it -d --name blog_backEnd --link blog_redis:blog_redis --link blog_mongo:blog_mongo bachend:v1
```



### 前端React部署

```shell
[root@localhost Front]# cat frontFile 
FROM node:latest

COPY antdblog.zip /root/

RUN cd /root/ && \
    unzip /root/antdblog.zip && \
    chmod -R +x /root/antdblog

WORKDIR /root/antdblog

CMD ["npm", "start"]

[root@localhost Front]# docker build -t front:v1 -f frontFile .
[root@localhost Front]# docker run -it -d --name blog_front --link blog_backEnd:blog_backEnd -p 80:3000 front:v1
```



## 汗流浃背了

```shell
[root@localhost BackEnd]# df -Th
Filesystem              Type      Size  Used Avail Use% Mounted on
devtmpfs                devtmpfs  898M     0  898M   0% /dev
tmpfs                   tmpfs     910M     0  910M   0% /dev/shm
tmpfs                   tmpfs     910M  9.7M  901M   2% /run
tmpfs                   tmpfs     910M     0  910M   0% /sys/fs/cgroup
/dev/mapper/centos-root xfs        27G   27G   40K 100% /
/dev/sda1               xfs      1014M  151M  864M  15% /boot
overlay                 overlay    27G   27G   40K 100% /var/lib/docker/overlay2/7a0cc67
tmpfs                   tmpfs     182M     0  182M   0% /run/user/0
```

原因，docker镜像没有深度清理！

```shell
[root@localhost overlay2]# docker system prune

# 删除没有被使用的镜像， /var/lib/docker/overlay2/相关文件还在。。。。
[root@localhost ~]# docker image prune -a 
# 删除所有镜像
[root@localhost overlay2]# docker system prune -a --force 
```

