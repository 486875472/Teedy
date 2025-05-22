pipeline {
    agent any
    environment {
        DEPLOYMENT_NAME = "hello-node"               // Kubernetes 中的 Deployment 名
        CONTAINER_NAME = "teedy-app"                // Deployment 中的容器名
        IMAGE_NAME = "huihui2003/teedy-app:24"       // Docker Hub 镜像
    }
    stages {
        stage('Start Minikube') {
            steps {
                sh '''
                    if ! minikube status | grep -q "Running"; then
                        echo "Starting Minikube..."
                        minikube start
                    else
                        echo "Minikube already running."
                    fi
                '''
            }
        }

        stage('Set Image in Kubernetes') {
            steps {
                sh '''
                    echo "Updating Kubernetes deployment image..."
                    kubectl set image deployment/${DEPLOYMENT_NAME} ${CONTAINER_NAME}=${IMAGE_NAME}
                '''
            }
        }

        stage('Verify') {
            steps {
                sh 'kubectl rollout status deployment/${DEPLOYMENT_NAME}'
                sh 'kubectl get pods'
            }
        }
    }
}
