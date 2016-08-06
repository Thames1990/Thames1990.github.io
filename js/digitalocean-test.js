//  see of we can obtain the token from localStorage
var token = localStorage.getItem('TOKEN');

//  if no token is found, we ask for it
if (!token || token == null) {
    token = prompt('Your DigitalOcean API token please');

    //  ask permission to store the token in localStorage
    if (confirm('Do you want to save this token in localStorage?'))
        localStorage.setItem('TOKEN', token);
}

if (token != null) {
    //  and finally pass on the token to the DOv2 instance.
    DOv2.token(token);

    DOv2.Droplets.list(function (error, result, next) {
        if (!error) {
            console.log(result);  //  Contains an array of Droplet items
            $('body > div > div > div > article').append('<pre>' + JSON.stringify(result, null, "\t") + '</pre>');
        }

        if (next) {
            //  next is a function which expects a callback function and will retrieve the next items for this call
            //  in this case: Droplets
            console.log('and there are more..');
        }
    });
}