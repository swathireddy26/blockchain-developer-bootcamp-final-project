modifier onlyOwner () {
    //only Owner is granted permission to execute a task
}

function addParticipant(address recipient) public onlyOwner {
    // function to include a participant into DAO reward system
}

function removeParticipant(address recipient) public onlyOwner {
    // function to remove a participant from DAO reward system
}

function grantTokens() {
    // Tokens will be issued to all participants in the system at the start of an epoch
}

function rewardContributors(address[] participants) {
    // Reward the participants only during the epoch
}

function burn(address[] participants) {
    // burn the tokens from the participants which are not used for rewarding after the epoch
}



