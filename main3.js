const SHA256 = require('crypto-js/sha256');

//트렌젝션 class
class Transactions{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{

    //블록의 구성 요소
    constructor(timestamp, transactions, previousHash = ''){ 
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    //요소를 모두 넣으면 해시값이 나온다.
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + this.transactions + JSON.stringify(this.transactions) + this.nonce).toString();
    }
//채굴 프로세스
    mineBlock(difficulty){
      while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
        this.nonce++;  
        this.hash = this.calculateHash();
      }

      console.log("Block mined: " + this.hash);
  }
}

class Blockchain{
    //블록체인 관련 클래스
    constructor(){
        this.chain = [this.createGenesisBlock()];
        // this.difficulty = 2;
        this.difficulty = 4;
        this.pendingTransactions = []; //대기중인 트랜잭션이 들어가는 공간 (memory pool)
        this.miningReward = 100;
    }
    //생성할 때 Block 객체를 만들면서 시작 -> 제네시스 블록 생성

    createGenesisBlock(){
        return new Block(0,"09/01/2020","GenesisBlock","0");
    }
    // 최신 블록 가져오는 함수
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //대기중인 트렌젝션 처리하기 - memory pool , TX (pending Transactions)
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block Successfuly mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ];
    }

    //TX만드는함수
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    //잔고 불러오는 함수
    getBalanceOfAddress(address) {
        let balance = 0;
    
        for (const block of this.chain) {
          for (const trans of block.transactions) {
            if (trans.fromAddress === address) {
              balance -= trans.amount;
            }
    
            if (trans.toAddress === address) {
              balance += trans.amount;
            }
          }
        }
    
        return balance;
    }

    //유효성 검사
    isChainValid(){
        for(let i =1; i < this.chain.length; i++){ //확인을 
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
                //해시를 다시 해서 정보가 조작되었는지 확인
                if(currentBlock.hash!==currentBlock.calculateHash()){
                    return false;
                }
                //이전 블록의 해시값을 다시 계산하여 정보가 저작되었는지 확인
                if(currentBlock.previousHash!== previousBlock.hash){
                    return false;
                }
        }
                //조건을 다 통과 할 시 true 반환
                return true;
    }
}

let NewCoin = new Blockchain(); //새 블록체인 만들기

NewCoin.createTransaction(new Transactions('address1','address2',100));
NewCoin.createTransaction(new Transactions('address2','address1',50));

console.log('\n Starting the miner ...');
NewCoin.minePendingTransactions('timehacker-address');

console.log('\nBalance of timehacker is', NewCoin.getBalanceOfAddress('timehacker-address'));

console.log('\n Starting the miner again...');
NewCoin.minePendingTransactions('timehacker-address');
console.log('\nBalance of timehacker is', NewCoin.getBalanceOfAddress('timehacker-address'));
