document.getElementById("submitButton1").addEventListener("click", submit);

function submit(){
    let address = document.querySelector("#address")
    let count = document.querySelector("#count")
    let message = document.querySelector("#result");
    let network = document.querySelector('#networkChoice')

    console.log(network.value);

    if(address.value==null || count.value==null || count.value==undefined || address.value==undefined){
    message.innerHTML = 'Output = Enter both address and amount'; 
    return
    }
    try {
        let publicKey = new PublicKey(address.value);
        console.log(publicKey)
        let connection = new Connection(network.value, "confirmed");

        if(!connection || connection==null){
        message.innerHTML = `Output = No Account found with this ${address}` 
        return 
        }

        let amount = Number(count.value)

        let signature = connection.requestAirdrop(publicKey, amount*LAMPORTS_PER_SOL);
        let latestBlockHash =  connection.getLatestBlockhash();

        connection.confirmTransaction({blockhash:latestBlockHash.blockhash, 
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature});
        
        let response = Promise.resolve(connection.getAccountInfo(publicKey))
        response.then(
            function(value) {
                message.innerHTML = `Output = You have ${network.options[network.selectedIndex].text} solana count = ${value.lamports/LAMPORTS_PER_SOL}`;
            },
            function(error){
                message.innerHTML = `Output = ${error.message}`
            }
        );
    }
    catch(err){
        message.innerHTML = `Output = ${err.message}`
    }

}