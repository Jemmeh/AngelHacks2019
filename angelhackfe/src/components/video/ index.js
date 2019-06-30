import React from 'react';

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state= {};
    }

    componentDidMount () {
        const script = document.createElement("script");
      
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        document.body.appendChild(script);
      }

    componentDidMount() {
        var domain = "meet.jit.si";
        var options = {
            roomName: "JitsiMeetAPIExample",
            width: 700,
            height: 700,
            parentNode: document.querySelector('#meet')
        };
        var api = new JitsiMeetExternalAPI(domain, options);
    };

    render() {
        return(
            <div id="meet"></div>
            )
        };
}

export default Video;
