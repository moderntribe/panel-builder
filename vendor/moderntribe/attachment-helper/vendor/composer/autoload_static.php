<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit37f9aa7eb1eef96531f219bd700e8b78
{
    public static $prefixLengthsPsr4 = array (
        'A' => 
        array (
            'AttachmentHelper\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'AttachmentHelper\\' => 
        array (
            0 => __DIR__ . '/../..' . '/AttachmentHelper',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit37f9aa7eb1eef96531f219bd700e8b78::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit37f9aa7eb1eef96531f219bd700e8b78::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}