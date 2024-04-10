let base = new Signal("hi")
console.log(base)
console.log(base.value)

let der = base.derive(() => base.value + "-test")
let der2 = base.derive(() => Boolean(base.value))
der2.addEventListener("change", value => console.log(value))

console.log(der)
console.log(der2)
console.log(der.value)

base.value = "bye"
console.log(der.value)

base.value = ""
console.log(der.value)

console.log("====================")
{
    let new_sig = new Signal("test")
    let der3 = new_sig.derive(() => new_sig.value + "-beep")
    der3.addEventListener("change", value => console.log(value))
    new_sig.value = "ccc"

    console.log(der3.value)

    new_sig.value = "ddd"
}