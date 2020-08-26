const ws = (api, callback) => {
    const WebSocket = window.WebSocket || window.MozWebSocket;
    if (!WebSocket) {
        this.error("Error: WebSocket is not supported .");
        return;
    }
    const protocol = window.location.protocol === "http:" ? "ws:" : "wss:";
    const url = `${protocol}//${api}`;
    return new Socket(url, callback);
};

class Socket {
    /**
     * @description: 初始化实例属性，保存参数
     * @param {String} url ws的接口x
     * @param {Function} msgCallback 服务器信息的回调传数据给函数
     * @param {String} name 可选值 用于区分ws，用于debugger
     */
    constructor(url, msgCallback, name = "socket") {
        this.url = url;
        this.msgCallback = msgCallback;
        this.name = name;
        this.ws = null; // websocket对象
        this.status = null; // websocket是否关闭

        this.connect();
    }
    /**
     * @description: 初始化 连接websocket或重连webSocket时调用
     * @param {*} 可选值 要传的数据
     */
    connect() {
        // 新建 WebSocket 实例
        this.ws = new WebSocket(this.url);

        // ws建立连接
        this.ws.onopen = () => {
            this.status = "open";
            console.log(`${this.name}连接成功`);
        };

        // ws监听服务器端返回的信息
        this.ws.onmessage = e => {
            // 把数据传给回调函数，并执行回调
            const response = JSON.parse(e.data);
            return this.msgCallback(response);
        };

        // ws关闭回调
        this.ws.onclose = e => {
            this.closeHandle(e); // 判断是否关闭
        };

        // ws出错回调
        this.ws.onerror = e => {
            this.closeHandle(e); // 判断是否关闭
        };
    }

    // 发送信息给服务器
    sendHandle(data) {
        console.log(`${this.name}发送消息给服务器:`, data);
        return this.ws.send(data);
    }

    closeHandle() {
        // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
        if (this.status !== "close") {
            // console.log(`${this.name}断开，重连websocket...`);
            // 重连
            // this.connect();
        } else {
            console.log(`${this.name}websocket手动关闭`);
            // 关闭
            this.closeMyself();
        }
    }

    // 手动关闭ws
    closeMyself() {
        console.log(`关闭${this.name}`);
        this.status = "close";
        return this.ws.close();
    }
}

export default ws;
