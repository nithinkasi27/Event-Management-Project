pipeline {
    agent any

    parameters {
        string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Docker image tag')
        string(name: 'CONTAINER_NAME', defaultValue: 'cap-event-container', description: 'Name of the Docker container')
        string(name: 'HOST_PORT', defaultValue: '8080', description: 'Host port to map to container port 3003')
    }

    environment {
        DOCKER_IMAGE = "cap-event:${IMAGE_TAG}"
        DOCKER_HUB_REPO = "nithin2711/cap-event"
        ECR_REPO = "636768524979.dkr.ecr.eu-central-1.amazonaws.com/nithin-capgemini"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/nithinkasi27/Event-Management-Project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'Docker_credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh "docker tag ${DOCKER_IMAGE} ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                }
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-Credentials']]) {
                    script {
                        sh 'aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 636768524979.dkr.ecr.eu-central-1.amazonaws.com'
                    }
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                script {
                    sh "docker tag ${DOCKER_IMAGE} ${ECR_REPO}:${IMAGE_TAG}"
                    sh "docker push ${ECR_REPO}:${IMAGE_TAG}"
                }
            }
        }

        stage('deploy using kube') {


            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS-Credentials']]) {
                script {
                    sh "aws eks update-kubeconfig --name nithin-test-cluster --region eu-central-1"
                    sh "kubectl apply -f deployment.yml"
                }
            }
        }
    }
    }

    post {
        success {
            echo "✅ Build and deployment successful!"
        }
        failure {
            echo "❌ Build or deployment failed."
        }
        always {
            echo "📦 Pipeline completed."
        }
    }
}