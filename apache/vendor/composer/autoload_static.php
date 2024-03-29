<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit1eccaf5b05ba924ec5da92858f0cb385
{
    public static $prefixesPsr0 = array (
        'F' => 
        array (
            'ForceUTF8\\' => 
            array (
                0 => __DIR__ . '/..' . '/neitanod/forceutf8/src',
            ),
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixesPsr0 = ComposerStaticInit1eccaf5b05ba924ec5da92858f0cb385::$prefixesPsr0;
            $loader->classMap = ComposerStaticInit1eccaf5b05ba924ec5da92858f0cb385::$classMap;

        }, null, ClassLoader::class);
    }
}
