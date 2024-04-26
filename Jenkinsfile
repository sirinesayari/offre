pipeline {
    agent any
    stages {
        stage('Clone backend repository') {
            steps {
                dir('OpNet-PiWeb') {
                    git branch: 'main',
                    url: 'https://github.com/sarra19/OpNet-PiWeb.git'
                }
            }
        }
        stage('Install backend dependencies') {
            steps {
                dir('OpNet-PiWeb/Backend') {
                    sh 'npm install --force'
                }
            }
        }
        // stage('Build application') {
        //     steps {
        //         dir('OpNet-PiWeb/Backend') {
        //             script {
        //                 sh 'npm run dev'
        //             }
        //         }
        //     }
        // }
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'scanner'
                    withSonarQubeEnv('scanner') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=opnet-backend \
                        """
                    }
                }
            }
        }
    //    stage('Building images (node and mongo)') {
    //         steps{
        
    //              sh 'docker build -t chahdzhaira/nodemongoapp:6.0 .'
              
    //          }
    //         }

    }
}