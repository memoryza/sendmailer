var nodemailer = require('nodemailer');
var fs = require('fs');

function Mailer() {
    this.defaultParams = {
        from    : 'woshiceshiyonghu@126.com',
        to      : 'woshiceshiyonghu@126.com',
        subject : '邮件',
        content : '',
        path    : './index.html'
    };
    this.transporter =  nodemailer.createTransport({
        service: '126',
        use_authentication: false,
        auth: {
            user: 'woshiceshiyonghu@126.com',
            pass: 'test007'
        }
    });
}

Mailer.prototype.getParams =  function() {
    var pattern = /^(?:[a-zA-Z\d]+[_\-\+\.]?)*[a-zA-Z\d]+@(?:([a-zA-Z\d]+\-?)*[a-zA-Z\d]+\.)+([a-zA-Z]{2,})+$/;
    var len = process.argv.length;
    var from, to, subject, toList;

    switch(len) {
        case 5:
            from = process.argv[2];
            to  = process.argv[3];
            subject = process.argv[4];
            if(from.match(pattern)) {
                this.defaultParams.from = from;
            }
            toList = to.split(',');
            toList = toList.filter(function(item) {
                if(item.match(pattern)) return item;
            });
            if(toList && toList.length) {
                this.defaultParams.to = toList.join(',');
            }
            if(subject) {
                this.defaultParams.subject = subject.substr(0, 124);
            }
            break;
        default:
            break;
    }
    if(fs.existsSync(this.defaultParams.path)) {
        this.defaultParams.content  =fs.readFileSync(this.defaultParams.path, 'utf-8');
    } 
}

Mailer.prototype.send = function() {
    this.getParams();

    var mailOptions = {
        from    : this.defaultParams.from,
        to      : this.defaultParams.to, 
        subject : this.defaultParams.subject,
        html    : this.defaultParams.content
    };
    console.log(mailOptions)
    this.transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('send ok!');
        }
    });
}
var mail =  new Mailer();
mail.send();


