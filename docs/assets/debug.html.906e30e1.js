import{_ as e,o as t,a as o,e as u}from"./app.9245cea8.js";const r={},n=u(`<h1 id="\u7F16\u8BD1\u8C03\u8BD5k8s" tabindex="-1"><a class="header-anchor" href="#\u7F16\u8BD1\u8C03\u8BD5k8s" aria-hidden="true">#</a> \u7F16\u8BD1\u8C03\u8BD5k8s</h1><ol><li>\u51C6\u5907(linux\u73AF\u5883\u6216wsl\u5B50\u7CFB\u7EDF)</li></ol><blockquote><p>\u5B89\u88C5containerd\uFF0C\u53C2\u8003\uFF1A https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/#install-containerd</p></blockquote><blockquote><p>\u7981\u7528\u4EA4\u6362\u5206\u533A</p></blockquote><ol start="2"><li>\u4E0B\u8F7D\u6E90\u7801\u3010\u57FA\u4E8E1.24.2\u3011</li></ol><blockquote><p><code>git clone https://github.com/kubernetes/kubernetes.git</code></p></blockquote><ol start="3"><li>\u5B89\u88C5etcd</li></ol><blockquote><p><code>hack/install-etcd.sh</code></p></blockquote><blockquote><p><code>export PATH=&quot;/dir/to/repo/kubernetes/third_party/etcd:\${PATH}&quot;</code></p></blockquote><ol start="4"><li>\u7F16\u8BD1\u5E76\u542F\u52A8\u96C6\u7FA4</li></ol><blockquote><p><code>./hack/local-up-cluster.sh</code></p></blockquote><p>\u8DF3\u8FC7\u7F16\u8BD1\u542F\u52A8\u96C6\u7FA4</p><blockquote><p><code>./hack/local-up-cluster.sh -O</code></p></blockquote><p>\u7F16\u8BD1\u597D\u7684\u53EF\u6267\u884C\u7A0B\u5E8F\u5728_output/bin\u76EE\u5F55\uFF0C\u9ED8\u8BA4\u65E5\u5FD7\u5728/tmp\u76EE\u5F55</p><p>\u96C6\u7FA4\u542F\u52A8\u540E\uFF0C\u4F1A\u4E0B\u8F7Dk8s.gcr.io/pause\uFF0Ck8s.gcr.io/coredns/coredns\u955C\u50CF\uFF0C\u56FD\u5185\u88AB\u5899\u9700\u8981\u6302\u4EE3\u7406</p><ol start="5"><li>debug kubectl</li></ol><p>\u7F16\u8F91.vscode/launch.json:</p><div class="language-text ext-text"><pre class="language-text"><code>{
    &quot;version&quot;: &quot;0.2.0&quot;,
    &quot;configurations&quot;: [
        {
            &quot;name&quot;: &quot;kubectl&quot;,
            &quot;type&quot;: &quot;go&quot;,
            &quot;request&quot;: &quot;launch&quot;,
            &quot;mode&quot;: &quot;auto&quot;,
            &quot;program&quot;: &quot;\${workspaceFolder}/cmd/kubectl/kubectl.go&quot;,
            &quot;env&quot;: {
                &quot;KUBECONFIG&quot;:&quot;/var/run/kubernetes/admin.kubeconfig&quot;
            },
            &quot;args&quot;: [&quot;get&quot;,&quot;pods&quot;,&quot;--all-namespaces&quot;,&quot;-v=10&quot;]
        }
    ]
}
</code></pre></div><ol start="6"><li>debug apiserver \u6267\u884C\u4EE5\u4E0B\u547D\u4EE4\u67E5\u770Bapiserver\u542F\u52A8\u53C2\u6570</li></ol><div class="language-text ext-text"><pre class="language-text"><code>line=\`ps -ef|grep kube-apiserver|grep _output/bin\`;echo \\&quot;\${line#*bin/kube-apiserver }\\&quot;|sed &#39;s/ /&quot;,\\n&quot;/g&#39;
</code></pre></div><p>\u6839\u636E\u542F\u52A8\u53C2\u6570\uFF0C\u7F16\u8F91.vscode/launch.json\uFF0C\u4FEE\u6539&quot;args&quot;:[]\u9879, --secure-port=6443\u7AEF\u53E3\u53F7\u6539\u4E3A\u5176\u4ED6\u503C\uFF0C\u5426\u5219\u548C\u5DF2\u542F\u52A8apiserver\u7AEF\u53E3\u91CD\u590D\u4E86\uFF08\u6216\u8005\u628A\u5DF2\u542F\u52A8\u7684apiserver kill\u6389\uFF09\uFF1A</p><div class="language-text ext-text"><pre class="language-text"><code>        {
            &quot;name&quot;: &quot;kube-apiserver&quot;,
            &quot;type&quot;: &quot;go&quot;,
            &quot;request&quot;: &quot;launch&quot;,
            &quot;mode&quot;: &quot;auto&quot;,
            &quot;program&quot;: &quot;\${workspaceFolder}/cmd/kube-apiserver/apiserver.go&quot;,
            &quot;args&quot;: [&quot;--authorization-mode=Node,RBAC&quot;,
                &quot;--cloud-provider=&quot;,
                &quot;--cloud-config=&quot;,
                &quot;--v=3&quot;,
                &quot;--vmodule=&quot;,
                &quot;--audit-policy-file=/tmp/kube-audit-policy-file&quot;,
                &quot;--audit-log-path=/tmp/kube-apiserver-audit.log&quot;,
                &quot;--authorization-webhook-config-file=&quot;,
                &quot;--authentication-token-webhook-config-file=&quot;,
                &quot;--cert-dir=/var/run/kubernetes&quot;,
                &quot;--egress-selector-config-file=/tmp/kube_egress_selector_configuration.yaml&quot;,
                &quot;--client-ca-file=/var/run/kubernetes/client-ca.crt&quot;,
                &quot;--kubelet-client-certificate=/var/run/kubernetes/client-kube-apiserver.crt&quot;,
                &quot;--kubelet-client-key=/var/run/kubernetes/client-kube-apiserver.key&quot;,
                &quot;--service-account-key-file=/tmp/kube-serviceaccount.key&quot;,
                &quot;--service-account-lookup=true&quot;,
                &quot;--service-account-issuer=https://kubernetes.default.svc&quot;,
                &quot;--service-account-jwks-uri=https://kubernetes.default.svc/openid/v1/jwks&quot;,
                &quot;--service-account-signing-key-file=/tmp/kube-serviceaccount.key&quot;,
                &quot;--enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,Priority,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,NodeRestriction&quot;,
                &quot;--disable-admission-plugins=&quot;,
                &quot;--admission-control-config-file=&quot;,
                &quot;--bind-address=0.0.0.0&quot;,
                &quot;--secure-port=16443&quot;,
                &quot;--tls-cert-file=/var/run/kubernetes/serving-kube-apiserver.crt&quot;,
                &quot;--tls-private-key-file=/var/run/kubernetes/serving-kube-apiserver.key&quot;,
                &quot;--storage-backend=etcd3&quot;,
                &quot;--storage-media-type=application/vnd.kubernetes.protobuf&quot;,
                &quot;--etcd-servers=http://127.0.0.1:2379&quot;,
                &quot;--service-cluster-ip-range=10.0.0.0/24&quot;,
                &quot;--feature-gates=AllAlpha=false&quot;,
                &quot;--external-hostname=localhost&quot;,
                &quot;--requestheader-username-headers=X-Remote-User&quot;,
                &quot;--requestheader-group-headers=X-Remote-Group&quot;,
                &quot;--requestheader-extra-headers-prefix=X-Remote-Extra-&quot;,
                &quot;--requestheader-client-ca-file=/var/run/kubernetes/request-header-ca.crt&quot;,
                &quot;--requestheader-allowed-names=system:auth-proxy&quot;,
                &quot;--proxy-client-cert-file=/var/run/kubernetes/client-auth-proxy.crt&quot;,
                &quot;--proxy-client-key-file=/var/run/kubernetes/client-auth-proxy.key&quot;,
                &quot;--cors-allowed-origins=/127.0.0.1(:[0-9]+)?$,/localhost(:[0-9]+)?$&quot;]
        }
</code></pre></div>`,22),a=[n];function s(c,q){return t(),o("div",null,a)}var l=e(r,[["render",s],["__file","debug.html.vue"]]);export{l as default};
