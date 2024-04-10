{
    const event_types = [
        "change",
        "derived"
    ]

    const triggerChangeEvent = (signal, value) => {
        for(let [callback, _] of signal.events.change) {
            callback(value)
        }
    }

    const triggerDerivedEvent = (signal) => {
        for(let [callback, data] of signal.events.derived) {
            callback(data)
        }
    }

    const addEventListener = (signal, event_type, event_callback, event_data) => {
        if(!event_types.includes(event_type)) return;

        signal.events[event_type].push([event_callback, event_data])
    }

    const defineSignalValue = (signal, get_function, set_function) => {
        return Object.defineProperty(signal, "value", {
            get: get_function,
            set: set_function,
            enumerable: true,
            configurable: true,
        })
    }

    function DerivedSignal(format_function, depends_on = []) {
        this.events = {
            change: [],
            derived: []
        }
        
        let _value = format_function()
        
        this.derive = (format_function = undefined, depends_on=[]) => {
            triggerDerivedEvent(this)
            return new DerivedSignal(_value, format_function, [this, ...depends_on])
        }

        this.addEventListener = (event_type, event_callback) => {
            addEventListener(this, event_type, event_callback, {signal: this})
        }


        for(let signal of depends_on) {
            signal.addEventListener("change", () => {
                let formatted_new_value = format_function()
                if(_value === formatted_new_value) return;
                
                _value = formatted_new_value
                triggerChangeEvent(this, formatted_new_value)
            })
        }

        defineSignalValue(
            this,
            () => _value,
            () => {throw new Error("Derived Signal Values Can Not Be Changed.")}
        )
    }

    function Signal(default_value) {
        let _value = default_value

        this.events = {
            change: [],
            derived: []
        }

        this.derive = (format_function = () => this.value, depends_on=[]) => {
            triggerDerivedEvent(this)
            return new DerivedSignal(format_function, [this, ...depends_on])
        }

        this.addEventListener = (event_type, event_callback) => {
            addEventListener(this, event_type, event_callback, {signal: this})
        }

        defineSignalValue(
            this,
            () => _value,
            (new_value) => {
                _value = new_value
                triggerChangeEvent(this, new_value)
            }
        )
    }
}