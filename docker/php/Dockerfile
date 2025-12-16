# 1. Base Image: PHP 8.2 FPM (FastCGI Process Manager)
FROM php:8.2-fpm

# 2. Argument for User ID (Fixes permission issues on Linux/Mac)
ARG user
ARG uid

# 3. Install System Dependencies & Python 3
# - libpq-dev: Required for PostgreSQL
# - python3-full: The complete Python runtime
# - python3-pip: Package manager
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    python3 \
    python3-pip \
    python3-venv \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# 4. Install Redis Extension (Critical for Queues)
RUN pecl install redis && docker-php-ext-enable redis

# 5. Get Composer (PHP Package Manager)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Set Working Directory
WORKDIR /var/www/html

# 7. Create a Python Virtual Environment
# We isolate scraper dependencies to avoid conflicting with system tools
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 8. Install Python Requirements
# (We copy the file first to cache this layer if requirements don't change)
COPY ./scraper/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# 9. Create System User to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Switch to this user
USER $user

EXPOSE 9000
CMD ["php-fpm"]