#!groovy

try {
  node('aws-deploy') {
    try {
      def branchName = env.BRANCH_NAME
      stage('Checkout') {
        echo "Checking out ${branchName}"
        checkout scm
      }

      stage('Build') {
        node('predixci-node6.9') {
          checkout scm
          sh "npm config set registry https://repo.jenkins.build.ge.com/artifactory/api/npm/npm-virtual" //Use Caching repo for faster build

          echo 'Installing dependencies'
          sh 'chmod 700 jenkins-setup.sh'
          sh '. gnu-setup.sh'

          echo 'Building'
          sh 'npm run build'

          stash includes: '**' , name: 'artifact'
        }
      }

      stage ('Deploy') {
        unstash 'artifact'
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'evn-jenkins-creds']]) {
          sh "aws s3 cp ./dist/ s3://evncatalog.gepowertools.com/ --recursive --no-verify-ssl"
        }
      }
    } catch(err) {
        throw(err)
    }
  }
} catch(err) {
    throw(err)
}
