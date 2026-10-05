@echo off
set DIR=%~dp0
set MAVEN_OPTS=-Djavax.net.ssl.trustStoreType=WINDOWS-ROOT %MAVEN_OPTS%
"%DIR%apache-maven-3.9.9\bin\mvn.cmd" %*
