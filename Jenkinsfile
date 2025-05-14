pipeline {
    agent any
    environment {
        // Define environment variables
        // Jenkins credentials configuration
        DOCKER_HUB_CREDENTIALS = credentials('docker1')  // Docker Hub credentials ID store in Jenkins
        // Docker Hub Repository's name
        DOCKER_IMAGE = "huihui2003/teedy-app"  // Your Docker Hub user name and Repository's name
        DOCKER_TAG = "${env.BUILD_NUMBER}"  // Use build number as tag
    }
    stages {
        stage('Build') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/master']],
                    extensions: [],
                    userRemoteConfigs: [[url: 'https://github.com/486875472/Teedy.git']]  // Your GitHub repository
                )
                sh 'mvn -B -DskipTests clean package'  // Maven build command
            }
        }

        // Building Docker image
        stage('Building image') {
            steps {
                script {
                    // Assume Dockerfile is located at root
                    docker.build("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}")
                }
            }
        }

        // Uploading Docker images to Docker Hub
        stage('Upload image') {
            steps {
                script {
                    // Sign in to Docker Hub
                    docker.withRegistry('https://registry.hub.docker.com', 'docker1') {
                        // Push image
                        docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push()
                        // Optional: Label as latest
                        docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").push('latest')
                    }
                }
            }
        }

        // Running Docker container
        stage('Run containers') {
            steps {
                script {
                    // Stop and remove containers if they exist
                    sh 'docker stop teedy-container-8081 || true'
                    sh 'docker rm teedy-container-8081 || true'

                    // Run Container
                    docker.image("${env.DOCKER_IMAGE}:${env.DOCKER_TAG}").run(
                        '--name teedy-container-8081 -d -p 8081:8080'
                    )

                    // Optional: List all teedy-containers
                    sh 'docker ps --filter "name=teedy-container"'
                }
            }
        }
    }
}
