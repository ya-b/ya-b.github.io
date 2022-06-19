# 编译调试k8s

1. 准备(linux环境或wsl子系统)

> 安装containerd，参考： https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/#install-containerd

> 禁用交换分区

2. 下载源码【基于1.24.2】
> `git clone https://github.com/kubernetes/kubernetes.git`
3. 安装etcd
> `hack/install-etcd.sh`

> `export PATH="/dir/to/repo/kubernetes/third_party/etcd:${PATH}"`
4. 编译并启动集群
> `./hack/local-up-cluster.sh`

跳过编译启动集群
> `./hack/local-up-cluster.sh -O`

编译好的可执行程序在_output/bin目录，默认日志在/tmp目录

集群启动后，会下载k8s.gcr.io/pause，k8s.gcr.io/coredns/coredns镜像，国内被墙需要挂代理

5. debug kubectl

编辑.vscode/launch.json:
```:no-line-numbers
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "kubectl",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "program": "${workspaceFolder}/cmd/kubectl/kubectl.go",
            "env": {
                "KUBECONFIG":"/var/run/kubernetes/admin.kubeconfig"
            },
            "args": ["get","pods","--all-namespaces","-v=10"]
        }
    ]
}
```
6. debug apiserver
执行以下命令查看apiserver启动参数
```:no-line-numbers
line=`ps -ef|grep kube-apiserver|grep _output/bin`;echo \"${line#*bin/kube-apiserver }\"|sed 's/ /",\n"/g'
```
根据启动参数，编辑.vscode/launch.json，修改"args":[]项, --secure-port=6443端口号改为其他值，否则和已启动apiserver端口重复了（或者把已启动的apiserver kill掉）：
```:no-line-numbers
        {
            "name": "kube-apiserver",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "program": "${workspaceFolder}/cmd/kube-apiserver/apiserver.go",
            "args": ["--authorization-mode=Node,RBAC",
                "--cloud-provider=",
                "--cloud-config=",
                "--v=3",
                "--vmodule=",
                "--audit-policy-file=/tmp/kube-audit-policy-file",
                "--audit-log-path=/tmp/kube-apiserver-audit.log",
                "--authorization-webhook-config-file=",
                "--authentication-token-webhook-config-file=",
                "--cert-dir=/var/run/kubernetes",
                "--egress-selector-config-file=/tmp/kube_egress_selector_configuration.yaml",
                "--client-ca-file=/var/run/kubernetes/client-ca.crt",
                "--kubelet-client-certificate=/var/run/kubernetes/client-kube-apiserver.crt",
                "--kubelet-client-key=/var/run/kubernetes/client-kube-apiserver.key",
                "--service-account-key-file=/tmp/kube-serviceaccount.key",
                "--service-account-lookup=true",
                "--service-account-issuer=https://kubernetes.default.svc",
                "--service-account-jwks-uri=https://kubernetes.default.svc/openid/v1/jwks",
                "--service-account-signing-key-file=/tmp/kube-serviceaccount.key",
                "--enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,Priority,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,NodeRestriction",
                "--disable-admission-plugins=",
                "--admission-control-config-file=",
                "--bind-address=0.0.0.0",
                "--secure-port=16443",
                "--tls-cert-file=/var/run/kubernetes/serving-kube-apiserver.crt",
                "--tls-private-key-file=/var/run/kubernetes/serving-kube-apiserver.key",
                "--storage-backend=etcd3",
                "--storage-media-type=application/vnd.kubernetes.protobuf",
                "--etcd-servers=http://127.0.0.1:2379",
                "--service-cluster-ip-range=10.0.0.0/24",
                "--feature-gates=AllAlpha=false",
                "--external-hostname=localhost",
                "--requestheader-username-headers=X-Remote-User",
                "--requestheader-group-headers=X-Remote-Group",
                "--requestheader-extra-headers-prefix=X-Remote-Extra-",
                "--requestheader-client-ca-file=/var/run/kubernetes/request-header-ca.crt",
                "--requestheader-allowed-names=system:auth-proxy",
                "--proxy-client-cert-file=/var/run/kubernetes/client-auth-proxy.crt",
                "--proxy-client-key-file=/var/run/kubernetes/client-auth-proxy.key",
                "--cors-allowed-origins=/127.0.0.1(:[0-9]+)?$,/localhost(:[0-9]+)?$"]
        }
```