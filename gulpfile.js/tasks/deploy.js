var fs = require('fs-extra');
var child_process = require('child_process');
var {settings} = require('../setup.js');

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    child_process.exec(command.replace(/\n/g, ' '), (error, stdout) => {
      if (error !== null) {
        console.log(error);
        reject();
      } else {
        resolve(stdout);
      }
    });
  });
}

async function prepareCloudformation() {
  var input = {};
  ['00/s3', 'as2/30-static', 'includes/footer', 'includes/header-transform', 'includes/header', 'ue1/50-server-edge'].forEach(function(path) {
    input[path.split('/').pop().split('-').pop().replace('static', 'sta')] = fs.readFileSync(`./cloudformation/${path}.yml`, 'utf8');
  });
  var {s3, sta, footer, transform, header, edge} = input;
  var files = {
    s3: header + s3,
    ue1: header + edge,
    as2: transform + header + sta + footer,
  };
  await fs.ensureDir('aws-temp');
  return new Promise((resolve, reject) => {
    var done = 0;
    Object.keys(files).forEach(function(id) {
      var template_body = files[id];
      var filePath = `./aws-temp/${id}.yml`;
      fs.writeFileSync(filePath, template_body);
      child_process.exec(`aws cloudformation validate-template --template-body file://${filePath}`, (error) => {
        if (error !== null) {
          reject(id + ' template could not be validated');
        } else {
          if (Object.keys(files).length == ++done) {
            resolve();
          }
        }
      });
    });
  });
}

async function deploy(cb) {
  var {environment, client, project, domain, subdomain, server_edge, cache_control_max_age, sslcert, distribution_id} = settings;
  var env = environment.replace('development', 'dev').replace('production', 'prod');
  var tags = `client=${client} project=${project} environment=${environment}`;
  var params= tags + ` domain=${domain} subdomain=${subdomain} sslcert=${sslcert} serverEdge=${server_edge}`;

  await prepareCloudformation();

  await runCommand(`aws cloudformation deploy
  --profile default
  --region ap-southeast-2
  --stack-name ${client}-cfn-as2-${env}-${project}
  --tags ${tags}
  --parameter-overrides ${params}
  --no-fail-on-empty-changeset
  --template-file aws-temp/s3.yml`);

  await runCommand(`aws cloudformation deploy
  --profile default
  --region us-east-1
  --stack-name ${client}-cfn-ue1-${env}-${project}-stack
  --tags ${tags}
  --parameter-overrides ${params}
  --no-fail-on-empty-changeset
  --template-file aws-temp/ue1.yml
  --capabilities CAPABILITY_NAMED_IAM`);

  await runCommand(`aws cloudformation package
  --profile default
  --region ap-southeast-2
  --template-file aws-temp/as2.yml
  --output-template-file aws-temp/as2.package.yml
  --s3-bucket ${client}-s3-as2-${env}-${project}
  --s3-prefix build`);

  await runCommand(`aws cloudformation deploy
  --profile default
  --region ap-southeast-2
  --template-file aws-temp/as2.package.yml
  --stack-name ${client}-cfn-as2-${env}-${project}-stack
  --tags ${tags}
  --parameter-overrides ${params}
  --no-fail-on-empty-changeset
  --capabilities CAPABILITY_NAMED_IAM
  --s3-bucket ${client}-s3-as2-${env}-${project}
  --s3-prefix cloudformation/`);

  await runCommand(`aws s3 sync dist/ s3://${client}-s3-as2-${env}-${project}-static/www/
  --profile default
  --cache-control max-age=${cache_control_max_age}`);

  if (distribution_id) {
    await runCommand(`aws cloudfront create-invalidation
    --profile default
    --distribution-id ${distribution_id}
    --paths "/*"`);
  }
  cb();
}

exports.deploy = deploy;
