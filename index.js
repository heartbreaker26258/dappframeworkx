// 引入依赖库
const express = require('express');
const { ethers } = require('ethers');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// 初始化环境变量
dotenv.config();

// 设置Express应用
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny')); // 日志记录

// 设置以太坊提供者和合约信息
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL); // 使用Infura节点
const contractAddress = process.env.CONTRACT_ADDRESS; // 智能合约地址
const contractABI = JSON.parse(process.env.CONTRACT_ABI); // 智能合约的ABI

// 创建合约实例
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// API路由
// 获取合约状态
app.get('/contract-state', async (req, res) => {
    try {
        // 假设合约中有一个名为getValue的方法
        const value = await contract.getValue();
        res.json({ value });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching contract state');
    }
});

// 发送交易（需要私钥和签名者）
app.post('/send-transaction', async (req, res) => {
    try {
        const { privateKey, to, value } = req.body;
        const wallet = new ethers.Wallet(privateKey, provider);
        const tx = await wallet.sendTransaction({ to, value });
        res.json({ transactionHash: tx.hash });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending transaction');
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
