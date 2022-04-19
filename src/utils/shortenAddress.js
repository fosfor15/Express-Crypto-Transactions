
function shortenAddress(address) {
    return address.replace(
        /^(0x\w{10})\w+(\w{4})$/,
        (m, start, end) => `${start}.....${end}\n`
    );
}

export default shortenAddress;
