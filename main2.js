const SHA256 = require('crypto-js/sha256');

class Block{

    //블록의 구성 요소
    constructor(index, timestamp, data, previousHash = ''){ 
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    //요소를 모두 넣으면 해시값이 나온다.
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + this.data + JSON.stringify(this.data) + this.nonce).toString();
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
    }
    //생성할 때 Block 객체를 만들면서 시작 -> 제네시스 블록 생성

    createGenesisBlock(){
        return new Block(0,"09/01/2020","GenesisBlock","0");
    }
    // 최신 블록 가져오는 함수
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    //블록 더하는것
    addBlock(newBlock){
            newBlock.previousHash = this.getLatestBlock().hash;
            newBlock.mineBlock(this.difficulty); 
            this.chain.push(newBlock);
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

console.log('mine block 1 ...');
NewCoin.addBlock(new Block(1, "10/08/2020", {amount : 4})); //1번 블록 추가

console.log('mine block 2 ...');
NewCoin.addBlock(new Block(2, "12/11/2020", {amount : 10})); //2번 블록 추가

// 출력이 다음과 같이 00이 2개가 나온다. difficulty가 2라서!
// mine block 1 ...
// Block mined: 005ceb1f71f9d08aa7ce83ab4f962bc9b9b02cf2b350b0f068681e1705e84470
// mine block 2 ...
// Block mined: 00ad133bbaed66172b7aad068a36358f7dcd6fa8dc5af2657580a9bdafd0305e

// 출력이 다음과 같이 00이 2개가 나온다. difficulty가 4라서!
// mine block 1 ...
// Block mined: 000055ea3e3c7520213597418026e66fc61491c25e0b3967d3d8c7e55199c1b6
// mine block 2 ...
// Block mined: 0000def0497ec37278a6a16f01ba18d4fae6c511c62b6960bcfbf40c0d88fba7